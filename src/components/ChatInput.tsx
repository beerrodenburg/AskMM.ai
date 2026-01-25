'use client';

import { FormEvent, KeyboardEvent } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
      />
    </svg>
  );
}

export function ChatInput({ value, onChange, onSend, disabled = false }: ChatInputProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSend();
      }
    }
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="sticky bottom-0 w-full bg-surface border-t border-neutral-200 px-4 py-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto flex items-center gap-3"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask me anything about Medical Medium..."
            className="w-full px-5 py-3 bg-surface-secondary rounded-full text-foreground text-[15px] placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-sage-500/20 transition-shadow duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Message input"
          />
        </div>

        <button
          type="submit"
          disabled={!canSend}
          className="w-11 h-11 flex-shrink-0 bg-sage-500 rounded-full flex items-center justify-center hover:bg-sage-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-sage-500 disabled:active:scale-100 transition-all duration-200"
          aria-label="Send message"
        >
          <ArrowUpIcon className="w-5 h-5 text-white" />
        </button>
      </form>
    </div>
  );
}
