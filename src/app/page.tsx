"use client";

import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { ResultCard } from "@/components/ResultCard";
import { SearchSkeleton } from "@/components/SearchSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { PWAProvider } from "@/components/PWAProvider";
import type { SearchResult } from "@/lib/types";

const SUGGESTED_QUERIES = [
  "Heavy metal detox smoothie",
  "Celery juice benefits",
  "Healing Epstein-Barr virus",
  "Liver rescue morning routine",
  "Foods that heal the thyroid",
  "Chronic fatigue causes",
];

type SearchState = "idle" | "loading" | "results" | "empty" | "error";

export default function Home() {
  const [state, setState] = useState<SearchState>("idle");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [query, setQuery] = useState("");

  const search = useCallback(async (q: string) => {
    setQuery(q);
    setState("loading");
    setResults([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();
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
  }, []);

  const isCompact = state !== "idle";

  return (
    <PWAProvider>
    <div className="flex flex-col min-h-[100dvh] bg-[var(--background)]">
      <Header />

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
                Search Medical Medium
              </h1>
              <p className="text-base text-[var(--muted)] max-w-md mx-auto">
                Find specific moments in Anthony William&apos;s YouTube videos.
                Ask a question, get timestamped answers.
              </p>
            </div>
          )}

          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={search}
            disabled={state === "loading"}
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
    </div>
    </PWAProvider>
  );
}
