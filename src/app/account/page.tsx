import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";

const CHECKOUT_URL = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL ?? "#";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/signin");

  const serviceClient = await createServiceClient();
  const { data: subscription } = await serviceClient
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .single();

  const isActive =
    subscription?.status === "active" &&
    subscription.current_period_end &&
    new Date(subscription.current_period_end) > new Date();

  const periodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <div id="app-shell" className="flex flex-col min-h-[100dvh] bg-[var(--background)]">
      <Header />
      <main className="flex-1 px-6 py-12">
        <div className="max-w-sm mx-auto">
          <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-8">Account</h1>

          {/* Profile */}
          <section className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl p-5 mb-4">
            <p className="text-xs text-[var(--muted)] mb-1">Signed in as</p>
            <p className="text-sm font-medium text-[var(--foreground)] truncate">{user.email}</p>
          </section>

          {/* Subscription */}
          <section className="bg-[var(--surface)] border border-[var(--border-subtle)] rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-[var(--foreground)]">Plan</p>
              {isActive ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-primary-500/15 text-primary-500 font-medium">
                  Supporter
                </span>
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--background)] border border-[var(--border-subtle)] text-[var(--muted)]">
                  Free
                </span>
              )}
            </div>

            {isActive ? (
              <>
                <p className="text-xs text-[var(--muted)] mb-4">
                  Unlimited searches. Renews {periodEnd}.
                </p>
                <a
                  href="https://app.lemonsqueezy.com/my-orders"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 px-4 text-center text-sm font-medium text-[var(--foreground)] bg-[var(--background)] border border-[var(--border-subtle)] rounded-xl hover:border-[var(--border)] transition-colors"
                >
                  Manage billing
                </a>
              </>
            ) : (
              <>
                <p className="text-xs text-[var(--muted)] mb-4">
                  3 free searches per day.
                </p>
                <a
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 px-4 text-center text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors"
                >
                  Support AskMM — $5/month
                </a>
              </>
            )}
          </section>

          {/* Sign out */}
          <form action={signOut}>
            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
              Sign out
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-primary-500 hover:underline">
              Back to search
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
