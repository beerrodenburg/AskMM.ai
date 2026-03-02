import Link from "next/link";
import { SearchUsageBadge } from "./SearchUsageBadge";

interface HeaderProps {
  onLogoClick?: () => void;
  searchesRemaining?: number | null;
  searchesLimit?: number;
}

export function Header({ onLogoClick, searchesRemaining, searchesLimit = 3 }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
      <Link
        href="/"
        onClick={onLogoClick}
        className="flex items-center group"
      >
        <span className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          Ask<span className="text-primary-500">MM</span>.ai
        </span>
      </Link>

      <nav className="flex items-center gap-4">
        {searchesRemaining != null && (
          <SearchUsageBadge remaining={searchesRemaining} limit={searchesLimit} />
        )}
        <Link
          href="/about"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          About
        </Link>
        <Link
          href="/account"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Account
        </Link>
      </nav>
    </header>
  );
}
