'use client';

interface HeaderProps {
  onLogoClick?: () => void;
}

export function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          aria-label="Return to start"
        >
          <h1 className="text-xl font-semibold tracking-tight select-none">
            <span className="text-sage-500">AskMM</span>
            <span className="text-muted font-normal">.ai</span>
          </h1>
        </button>

      </div>
    </header>
  );
}
