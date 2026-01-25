'use client';

import { useState, useEffect } from 'react';

const STATUS_MESSAGES = [
  "Searching through AW's livestreams for you…",
  'Analyzing relevant discussions…',
  'Finding the best answer…',
  'Preparing your response…',
];

const CYCLE_INTERVAL = 2500;

export function LoadingStatus() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
        setIsVisible(true);
      }, 200);
    }, CYCLE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-start w-full animate-fade-in">
      <div className="flex items-center gap-3 px-4 py-3 bg-surface border border-neutral-200 rounded-[20px] rounded-tl-[6px] shadow-softer">
        <div className="flex gap-1">
          <span
            className="w-1.5 h-1.5 bg-sage-500 rounded-full animate-pulse-soft"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-1.5 h-1.5 bg-sage-500 rounded-full animate-pulse-soft"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-1.5 h-1.5 bg-sage-500 rounded-full animate-pulse-soft"
            style={{ animationDelay: '300ms' }}
          />
        </div>
        <span
          className={`text-sm text-muted transition-opacity duration-200 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {STATUS_MESSAGES[currentIndex]}
        </span>
      </div>
    </div>
  );
}
