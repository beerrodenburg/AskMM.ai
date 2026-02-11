import { Sparkles } from "lucide-react";

interface SummaryBannerProps {
  summary: string;
}

export function SummaryBanner({ summary }: SummaryBannerProps) {
  return (
    <div className="mb-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-3.5 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex gap-3 items-start">
        <Sparkles
          size={16}
          className="mt-0.5 shrink-0 text-primary-500"
        />
        <p className="text-sm leading-relaxed text-[var(--foreground)]">
          {summary}
        </p>
      </div>
    </div>
  );
}
