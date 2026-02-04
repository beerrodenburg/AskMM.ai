'use client';

import Link from 'next/link';

interface HeaderProps {
  onLogoClick?: () => void;
}

export function Header({ onLogoClick }: HeaderProps) {
  const logo = (
    <h1 className="text-xl font-semibold tracking-tight select-none">
      <span className="text-sage-500">AskMM</span>
      <span className="text-muted font-normal">.ai</span>
    </h1>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        {onLogoClick ? (
          <button
            onClick={onLogoClick}
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            aria-label="Return to start"
          >
            {logo}
          </button>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            aria-label="Return to chat"
          >
            {logo}
          </Link>
        )}
        <Link
          href="/about"
          className="flex items-center justify-center w-8 h-8 rounded-full text-muted hover:text-sage-500 hover:bg-neutral-100 transition-colors"
          aria-label="About AskMM.ai"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 9V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="6.5" r="1" fill="currentColor" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
