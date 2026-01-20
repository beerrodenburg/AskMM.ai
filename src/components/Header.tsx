'use client';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-neutral-100">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <h1 className="text-xl font-semibold tracking-tight select-none">
            <span className="text-[#10B981]">AskMM</span>
            <span className="text-[#a3a3a3] font-normal">.ai</span>
          </h1>
        </div>

      </div>
    </header>
  );
}
