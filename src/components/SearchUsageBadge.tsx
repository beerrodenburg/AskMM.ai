interface SearchUsageBadgeProps {
  remaining: number;
  limit: number;
}

export function SearchUsageBadge({ remaining, limit }: SearchUsageBadgeProps) {
  const used = limit - remaining;
  const isNearLimit = remaining <= 1;

  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
        isNearLimit
          ? "text-amber-500 border-amber-500/30 bg-amber-500/10"
          : "text-[var(--muted)] border-[var(--border-subtle)] bg-[var(--surface)]"
      }`}
    >
      {used}/{limit} searches
    </span>
  );
}
