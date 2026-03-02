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
  const url = `${checkoutUrl}?checkout[email]=${encodeURIComponent(user.email!)}`
  return NextResponse.redirect(url)
}
