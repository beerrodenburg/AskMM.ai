"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const SHOW_BANNER = true;
const BANNER_KEY = "askmm-banner-donate-v1";

export function AnnouncementBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (SHOW_BANNER && !localStorage.getItem(BANNER_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function dismiss() {
    localStorage.setItem(BANNER_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="bg-primary-600 text-white text-sm text-center px-4 py-2 flex items-center justify-center gap-3">
      <span>
        AskMM.ai is free and runs on community donations. If it&apos;s helped you,{" "}
        <Link
          href="https://ko-fi.com/beer"
          target="_blank"
          rel="noopener noreferrer"
          className="underline opacity-90 hover:opacity-100 transition-opacity"
        >
          consider supporting ♥
        </Link>
      </span>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="text-white/70 hover:text-white transition-colors cursor-pointer flex-shrink-0"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M1 1l12 12M13 1L1 13" />
        </svg>
      </button>
    </div>
  );
}
