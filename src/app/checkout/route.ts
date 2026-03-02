import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const origin = new URL(request.url).origin

  if (!user) {
    return NextResponse.redirect(`${origin}/auth/signin?next=/checkout`)
  }

  const checkoutUrl = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL!
  const redirectUrl = new URL(checkoutUrl)
  redirectUrl.searchParams.set('checkout[email]', user.email!)
  redirectUrl.searchParams.set('checkout[custom][user_id]', user.id)
  return NextResponse.redirect(redirectUrl.toString())
}
