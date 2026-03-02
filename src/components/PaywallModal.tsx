"use client";

import Link from "next/link";

interface PaywallModalProps {
  onClose: () => void;
}

const CHECKOUT_URL = process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL ?? "#";

export function PaywallModal({ onClose }: PaywallModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-sm bg-[var(--surface)] rounded-2xl p-6 shadow-xl border border-[var(--border-subtle)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-primary-500/15 flex items-center justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2l2.4 5 5.6.8-4 3.9.9 5.5L10 14.5l-4.9 2.7.9-5.5L2 7.8l5.6-.8L10 2z" fill="var(--primary-500, #15A06F)" opacity="0.9"/>
          </svg>
        </div>

        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">
          You've used your 3 free searches today
        </h2>
        <p className="text-sm text-[var(--muted)] mb-6 leading-relaxed">
          Support AskMM to keep this tool free for everyone — and get unlimited searches for yourself.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium text-sm rounded-xl text-center transition-colors"
          >
            Support AskMM — $5/month
          </a>
          <Link
            href="/auth/signin"
            onClick={onClose}
            className="w-full py-3 px-4 bg-[var(--background)] hover:bg-[var(--border-subtle)] text-[var(--foreground)] font-medium text-sm rounded-xl text-center transition-colors border border-[var(--border-subtle)]"
          >
            Sign in
          </Link>
          <p className="text-xs text-[var(--muted)] text-center">
            Free limit resets daily at midnight UTC
          </p>
        </div>
      </div>
    </div>
  );
}
