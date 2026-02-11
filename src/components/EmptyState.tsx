import { SearchX } from "lucide-react";

interface EmptyStateProps {
  query: string;
}

export function EmptyState({ query }: EmptyStateProps) {
  return (
    <div className="text-center py-12 animate-[fadeIn_0.4s_ease-out]">
      <SearchX
        size={40}
        className="mx-auto mb-4 text-[var(--muted)]"
        strokeWidth={1.5}
      />
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
        No results found
      </h3>
      <p className="text-sm text-[var(--muted)] max-w-sm mx-auto">
        We couldn&apos;t find any Medical Medium content matching
        &ldquo;{query}&rdquo;. Try rephrasing your question or using different
        keywords.
      </p>
    </div>
  );
}
