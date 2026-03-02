import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createSSRClient } from '@/lib/supabase/server'

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST() {
  const supabase = await createSSRClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ ok: false }, { status: 401 })

  await serviceClient
    .from('subscriptions')
    .update({ user_id: user.id })
    .eq('user_email', user.email)
    .is('user_id', null)

  return NextResponse.json({ ok: true })
}
