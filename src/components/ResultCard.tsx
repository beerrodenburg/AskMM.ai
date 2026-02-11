import { ExternalLink, Clock } from "lucide-react";
import { VideoEmbed } from "@/components/VideoEmbed";
import type { SearchResult } from "@/lib/types";

interface ResultCardProps {
  result: SearchResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const videoLink = `${result.videoUrl}&t=${result.timestampSeconds}s`;

  return (
    <div className="card overflow-hidden">
      <VideoEmbed
        videoUrl={result.videoUrl}
        timestampSeconds={result.timestampSeconds}
        title={result.videoTitle}
      />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="badge">
            <Clock size={12} />
            {result.timestamp}
          </span>
        </div>

        <h3 className="text-[15px] font-semibold leading-snug text-[var(--foreground)] mb-2">
          {result.videoTitle}
        </h3>

        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-3">
          {result.summary}
        </p>

        <a
          href={videoLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 text-xs text-[var(--muted)] hover:text-primary-500 transition-colors"
        >
          <ExternalLink size={12} />
          <span>Open on YouTube at {result.timestamp}</span>
        </a>
      </div>
    </div>
  );
}
