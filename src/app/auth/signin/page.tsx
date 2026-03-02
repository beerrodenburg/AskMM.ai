"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Link any pending subscription for this email
      await fetch('/api/link-subscription', { method: 'POST' });
      router.push(next);
      router.refresh();
    }
  }

  const signUpHref = next !== "/" ? `/auth/signup?next=${encodeURIComponent(next)}` : "/auth/signup";

  return (
    <div id="app-shell" className="flex flex-col min-h-[100dvh] bg-[var(--background)]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-1">Sign in</h1>
          <p className="text-sm text-[var(--muted)] mb-8">
            Don&apos;t have an account?{" "}
            <Link href={signUpHref} className="text-primary-500 hover:underline">
              Sign up
            </Link>
          </p>

          {/* Email/password form */}
          <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--foreground)] text-sm placeholder:text-[var(--muted)] focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm text-[var(--muted)]">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-primary-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--foreground)] text-sm placeholder:text-[var(--muted)] focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-colors"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
