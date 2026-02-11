"use client";

import { type FormEvent } from "react";
import { Search, ArrowRight } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search Medical Medium content\u2026",
  disabled = false,
}: SearchBarProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)] group-focus-within:text-primary-500 transition-colors"
          aria-hidden="true"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-12 pr-12 py-3.5 text-base bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--muted)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Search query"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Search"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </form>
  );
}
