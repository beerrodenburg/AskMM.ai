"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, Clock, ExternalLink } from "lucide-react";
import { VideoEmbed } from "@/components/VideoEmbed";
import type { SearchResult } from "@/lib/types";

interface ResultCardProps {
  result: SearchResult;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function ResultCard({ result }: ResultCardProps) {
  const videoLink = `${result.videoUrl}&t=${result.timestampSeconds}s`;
  const [expanded, setExpanded] = useState(false);
  const [isClampable, setIsClampable] = useState(false);
  const quoteRef = useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = quoteRef.current;
    if (!el) return;

    const measure = () => {
      const wasExpanded = !el.classList.contains("line-clamp-3");
      if (wasExpanded) {
        setIsClampable(true);
        return;
      }
      setIsClampable(el.scrollHeight > el.clientHeight + 1);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [result.summary]);

  return (
    <div className="card overflow-hidden">
      <VideoEmbed
        videoUrl={result.videoUrl}
        timestampSeconds={result.timestampSeconds}
        title={result.videoTitle}
      />

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="badge">
            <Clock size={12} />
            {result.timestamp}
          </span>
          {typeof result.relevancy === "number" && (() => {
            const pct = Math.max(0, Math.min(100, Math.round(result.relevancy * 100)));
            const tier =
              result.relevancy >= 0.7 ? "badge-match-strong"
              : result.relevancy >= 0.4 ? "badge-match-mid"
              : "badge-match-low";
            return (
              <span
                className={`badge ${tier}`}
                title="Cohere reranker relevance score"
              >
                {pct}% match
              </span>
            );
          })()}
        </div>

        <h3 className="text-[15px] font-semibold leading-snug text-[var(--foreground)] mb-2">
          {result.videoTitle}
        </h3>

        <p
          ref={quoteRef}
          className={`text-sm text-[var(--muted-foreground)] leading-relaxed italic ${
            expanded ? "" : "line-clamp-3"
          }`}
        >
          &ldquo;{result.summary}&rdquo;
        </p>

        {isClampable && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="flex w-fit items-center gap-1 mt-2 text-xs font-medium text-[var(--muted-foreground)] hover:text-primary-500 transition-colors cursor-pointer"
          >
            <span>{expanded ? "Show less" : "Show more"}</span>
            <ChevronDown
              size={12}
              className={`transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        )}

        <a
          href={videoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-fit items-center gap-1.5 mt-3 text-xs text-[var(--muted)] hover:text-primary-500 transition-colors"
        >
          <ExternalLink size={12} />
          <span>Open on YouTube at {result.timestamp}</span>
        </a>
      </div>
    </div>
  );
}
