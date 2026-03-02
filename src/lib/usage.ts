import { createServiceClient } from './supabase/server'

const DAILY_LIMIT = 3

export type UsageResult =
  | { allowed: true; remaining: number }
  | { allowed: false; searchesUsed: number; searchesLimit: number }

/**
 * Check if a search is allowed and increment the counter if so.
 * Pass userId for authenticated users, deviceId for anonymous users.
 * Authenticated users without an active subscription still count against the daily limit.
 */
export async function checkAndIncrementUsage(
  deviceId: string,
  userId?: string
): Promise<UsageResult> {
  const supabase = await createServiceClient()
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  // Authenticated user: check subscription first
  if (userId) {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .single()

    if (
      subscription?.status === 'active' &&
      subscription.current_period_end &&
      new Date(subscription.current_period_end) > new Date()
    ) {
      // Active subscriber — unlimited
      return { allowed: true, remaining: Infinity }
    }

    // Authenticated but no active subscription — apply daily limit per user
    // Check both user-keyed and device-keyed usage to prevent resetting the
    // counter by signing up after exhausting free searches as anonymous.
    const [{ data: userUsage, error: userError }, { data: deviceUsage }] = await Promise.all([
      supabase.from('anonymous_usage').select('count, reset_date').eq('device_id', `user:${userId}`).single(),
      supabase.from('anonymous_usage').select('count, reset_date').eq('device_id', deviceId).single(),
    ])

    if (userError && userError.code !== 'PGRST116') throw userError

    const userCount = !userUsage || userUsage.reset_date !== today ? 0 : userUsage.count
    const deviceCount = !deviceUsage || deviceUsage.reset_date !== today ? 0 : deviceUsage.count
    const count = Math.max(userCount, deviceCount)

    if (count >= DAILY_LIMIT) {
      return { allowed: false, searchesUsed: count, searchesLimit: DAILY_LIMIT }
    }

    await supabase.from('anonymous_usage').upsert({
      device_id: `user:${userId}`,
      count: count + 1,
      reset_date: today,
    })

    return { allowed: true, remaining: DAILY_LIMIT - count - 1 }
  }

  // Anonymous user — track by device ID
  const { data: usage, error } = await supabase
    .from('anonymous_usage')
    .select('count, reset_date')
    .eq('device_id', deviceId)
    .single()

  if (error && error.code !== 'PGRST116') throw error

  const count = !usage || usage.reset_date !== today ? 0 : usage.count

  if (count >= DAILY_LIMIT) {
    return { allowed: false, searchesUsed: count, searchesLimit: DAILY_LIMIT }
  }

  await supabase.from('anonymous_usage').upsert({
    device_id: deviceId,
    count: count + 1,
    reset_date: today,
  })

  return { allowed: true, remaining: DAILY_LIMIT - count - 1 }
}
