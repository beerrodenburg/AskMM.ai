"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/Header";

function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div id="app-shell" className="flex flex-col min-h-[100dvh] bg-[var(--background)]">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-1">Choose a new password</h1>
          <p className="text-sm text-[var(--muted)] mb-8">Must be at least 8 characters.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1.5">New password</label>
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

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-colors"
            >
              {loading ? "Saving…" : "Set new password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
