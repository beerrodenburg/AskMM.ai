import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
      <Link href="/" className="flex items-center group">
        <span className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          Ask<span className="text-primary-500">MM</span>.ai
        </span>
      </Link>

      <nav className="flex items-center gap-6">
        <Link
          href="/about"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          About
        </Link>
      </nav>
    </header>
  );
}
