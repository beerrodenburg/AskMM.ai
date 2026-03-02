"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { ResultCard } from "@/components/ResultCard";
import { SearchSkeleton } from "@/components/SearchSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { PWAProvider } from "@/components/PWAProvider";
import { PaywallModal } from "@/components/PaywallModal";
import { useDeviceId } from "@/hooks/useDeviceId";
import type { SearchResult } from "@/lib/types";

const SUGGESTED_QUERIES = [
  "How to heal cold sore",
  "AW robot dance",
  "What did AW say about bird flu",
  "What does AW say about dreams?",
  "Does he say anything about garlic?",
  "How long does it take to heal eczema?",
];

const SEARCH_LIMIT = 3;

type SearchState = "idle" | "loading" | "results" | "empty" | "error";

export default function Home() {
  const [state, setState] = useState<SearchState>("idle");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [searchesRemaining, setSearchesRemaining] = useState<number | null>(null);
  const deviceId = useDeviceId();
  const router = useRouter();

  // Safety net: Supabase may redirect auth errors to the site URL (/) if the
  // callback URL isn't in the allowed redirect list. Catch them here and forward
  // to the appropriate auth page so the user sees a meaningful message.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const errorCode = params.get("error_code");
    if (!error) return;
    if (errorCode === "otp_expired") {
      router.replace("/auth/forgot-password?error=link_expired");
    } else if (error === "access_denied") {
      router.replace("/auth/signin?error=auth_failed");
    }
  }, [router]);

  const search = useCallback(async (q: string) => {
    if (!deviceId) return;

    setQuery(q);
    setState("loading");
    setResults([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": deviceId,
        },
        body: JSON.stringify({ message: q }),
      });

      if (res.status === 429) {
        setState("idle");
        setShowPaywall(true);
        setSearchesRemaining(0);
        return;
      }

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();

      if (data._usage?.remaining != null) {
        setSearchesRemaining(data._usage.remaining);
      }

      const items: SearchResult[] = data.results ?? [];

      if (items.length === 0) {
        setState("empty");
      } else {
        setResults(items);
        setState("results");
      }
    } catch {
      setState("error");
    }
  }, [deviceId]);

  const isCompact = state !== "idle";

  return (
    <PWAProvider>
    <div id="app-shell" className="flex flex-col min-h-[100dvh] bg-[var(--background)]">
      <AnnouncementBanner />
      <Header
        onLogoClick={() => { setState("idle"); setQuery(""); setResults([]); }}
        searchesRemaining={searchesRemaining}
        searchesLimit={SEARCH_LIMIT}
      />

      <main className="flex-1 flex flex-col">
        {/* Hero / search area */}
        <section
          className={`flex flex-col items-center justify-center px-6 transition-all duration-500 ${
            isCompact ? "pt-8 pb-6" : "pt-24 pb-12 sm:pt-32"
          }`}
        >
          {!isCompact && (
            <div className="text-center mb-8 animate-[fadeIn_0.4s_ease-out]">
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--foreground)] mb-3">
                Search every Medical Medium video, instantly
              </h1>
              <p className="text-base text-[var(--muted)] max-w-md mx-auto">
                Ask a question and get answers pulled directly from
                Anthony William&apos;s YouTube videos &mdash; with timestamps
                so you can hear his actual words.
              </p>
            </div>
          )}

          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={search}
            disabled={state === "loading"}
            autoFocus={state === "idle"}
          />

          {/* Suggested queries */}
          {!isCompact && (
            <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-lg animate-[fadeIn_0.6s_ease-out]">
              {SUGGESTED_QUERIES.map((q) => (
                <button
                  key={q}
                  onClick={() => search(q)}
                  className="px-3 py-1.5 text-sm text-[var(--muted)] bg-[var(--surface)] border border-[var(--border-subtle)] rounded-full hover:border-[var(--border)] hover:text-[var(--foreground)] transition-all cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Content area */}
        <section className="flex-1 px-6 pb-12">
          <div className="max-w-2xl mx-auto">
            {state === "loading" && <SearchSkeleton />}

            {state === "results" && (
              <>
<p className="text-sm text-[var(--muted)] mb-4">
                  {results.length} result{results.length !== 1 ? "s" : ""} found
                </p>
                <div className="flex flex-col gap-3">
                  {results.map((result, i) => (
                    <div
                      key={`${result.videoUrl}-${result.timestampSeconds}`}
                      className="animate-[slideUp_0.5s_ease-out_both]"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <ResultCard result={result} />
                    </div>
                  ))}
                </div>
              </>
            )}

            {state === "empty" && <EmptyState query={query} />}

            {state === "error" && <ErrorState onRetry={() => search(query)} />}
          </div>
        </section>
      </main>

      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
    </div>
    </PWAProvider>
  );
}
