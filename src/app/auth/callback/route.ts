import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createSSRClient } from "@/lib/supabase/server";

const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const next = searchParams.get("next") ?? "/";

  // Handle error redirects from Supabase (e.g., expired or invalid OTP links)
  if (error) {
    if (errorCode === "otp_expired") {
      return NextResponse.redirect(`${origin}/auth/forgot-password?error=link_expired`);
    }
    return NextResponse.redirect(`${origin}/auth/signin?error=auth_failed`);
  }

  if (code) {
    const supabase = await createSSRClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      // Link any pending subscription that was created before the user had an account
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        await serviceClient
          .from('subscriptions')
          .update({ user_id: user.id })
          .eq('user_email', user.email)
          .is('user_id', null)
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed — redirect to sign in with error indicator
  return NextResponse.redirect(`${origin}/auth/signin?error=auth_failed`);
}
