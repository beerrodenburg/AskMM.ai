"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.session) {
      // Email confirmation is disabled — user is immediately signed in
      await fetch('/api/link-subscription', { method: 'POST' });
      router.push(next);
      router.refresh();
    } else {
      setSuccess(true);
    }
  }

  const signInHref = next !== "/" ? `/auth/signin?next=${encodeURIComponent(next)}` : "/auth/signin";

  if (success) {
    return (
      <div id="app-shell" className="flex flex-col min-h-[100dvh] bg-[var(--background)]">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm text-center">
            <div className="w-12 h-12 rounded-full bg-primary-500/15 flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 11l5 5 9-9" stroke="var(--primary-500, #15A06F)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--foreground)] mb-2">Check your email</h2>
            <p className="text-sm text-[var(--muted)]">
              We sent a confirmation link to <strong className="text-[var(--foreground)]">{email}</strong>.
              Click it to activate your account.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div id="app-shell" className="flex flex-col min-h-[100dvh] bg-[var(--background)]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-1">Create an account</h1>
          <p className="text-sm text-[var(--muted)] mb-8">
            Already have one?{" "}
            <Link href={signInHref} className="text-primary-500 hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSignUp} className="flex flex-col gap-4">
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
              <label className="block text-sm text-[var(--muted)] mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-[var(--border-subtle)] text-[var(--foreground)] text-sm placeholder:text-[var(--muted)] focus:outline-none focus:border-primary-500 transition-colors"
                placeholder="Min. 8 characters"
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
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
