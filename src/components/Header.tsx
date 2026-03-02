import Link from "next/link";
import { SearchUsageBadge } from "./SearchUsageBadge";

interface HeaderProps {
  onLogoClick?: () => void;
  searchesRemaining?: number | null;
  searchesLimit?: number;
  // undefined = loading, null = signed out, string = signed-in email
  userEmail?: string | null;
}

export function Header({ onLogoClick, searchesRemaining, searchesLimit = 3, userEmail }: HeaderProps) {
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
        {userEmail ? (
          <Link
            href="/account"
            title={userEmail}
            className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-semibold hover:bg-primary-600 transition-colors"
          >
            {userEmail[0].toUpperCase()}
          </Link>
        ) : (
          <Link
            href={userEmail === null ? "/auth/signin" : "/account"}
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            {userEmail === null ? "Sign in" : "Account"}
          </Link>
        )}
      </nav>
    </header>
  );
}
