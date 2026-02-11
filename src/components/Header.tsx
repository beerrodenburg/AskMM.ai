import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500 text-white text-sm font-bold tracking-tight">
          M
        </div>
        <span className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
          Ask<span className="text-primary-500">MM</span>
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
