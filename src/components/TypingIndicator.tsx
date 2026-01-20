'use client';

export function TypingIndicator() {
  return (
    <div className="flex justify-start w-full animate-fade-in">
      <div className="flex items-center gap-1 px-4 py-3 bg-white border border-[#e5e5e5] rounded-[20px] rounded-tl-[6px] shadow-softer">
        <span
          className="w-2 h-2 bg-[#d4d4d4] rounded-full animate-pulse-soft"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-2 h-2 bg-[#d4d4d4] rounded-full animate-pulse-soft"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-2 h-2 bg-[#d4d4d4] rounded-full animate-pulse-soft"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  );
}
