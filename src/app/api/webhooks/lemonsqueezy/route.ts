import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifySignature(rawBody: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(rawBody).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-signature') ?? ''
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const eventName = payload.meta?.event_name as string
  const data = payload.data?.attributes

  if (!data) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 })
  }

  const lsSubscriptionId = String(payload.data?.id)
  const lsCustomerId = String(data.customer_id)
  const userEmail = data.user_email as string | undefined
  const status = data.status as string
  const currentPeriodEnd = data.renews_at ?? data.ends_at ?? null

  if (!['subscription_created', 'subscription_updated', 'subscription_cancelled'].includes(eventName)) {
    // Ignore other events
    return NextResponse.json({ received: true })
  }

  // Look up user by email (may not exist if buyer skipped account creation)
  let userId: string | null = null
  if (userEmail) {
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const match = users.find(u => u.email === userEmail)
    if (match) userId = match.id
  }

  // Always write the subscription row — user_id may be null for frictionless-checkout buyers.
  // The auth callback will link user_id when the buyer creates an account.
  const { error } = await supabase
    .from('subscriptions')
    .upsert(
      {
        user_id: userId,
        user_email: userEmail ?? null,
        ls_customer_id: lsCustomerId,
        ls_subscription_id: lsSubscriptionId,
        status,
        current_period_end: currentPeriodEnd,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'ls_subscription_id' }
    )

  if (error) {
    console.error('Supabase upsert error:', error)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
