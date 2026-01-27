'use client';

import { useState, useEffect, useCallback } from 'react';

interface PWAInstallState {
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
  canInstall: boolean;
  showIOSPrompt: boolean;
  dismissPrompt: () => void;
}

const IOS_PROMPT_DISMISSED_KEY = 'askmm-ios-install-dismissed';
const DISMISS_DURATION_DAYS = 7;

export function usePWAInstall(): PWAInstallState {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect iOS (iPhone, iPad, iPod)
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) &&
                !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(iOS);

    // Detect Android
    const android = /Android/.test(navigator.userAgent);
    setIsAndroid(android);

    // Detect if running as standalone PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Check if should show iOS prompt
    if (iOS && !standalone) {
      const dismissedAt = localStorage.getItem(IOS_PROMPT_DISMISSED_KEY);
      if (dismissedAt) {
        const dismissedDate = new Date(parseInt(dismissedAt, 10));
        const now = new Date();
        const daysSinceDismiss = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceDismiss < DISMISS_DURATION_DAYS) {
          return; // Don't show prompt yet
        }
      }
      // Small delay before showing prompt for better UX
      const timer = setTimeout(() => setShowIOSPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissPrompt = useCallback(() => {
    setShowIOSPrompt(false);
    localStorage.setItem(IOS_PROMPT_DISMISSED_KEY, Date.now().toString());
  }, []);

  return {
    isIOS,
    isAndroid,
    isStandalone,
    canInstall: (isIOS || isAndroid) && !isStandalone,
    showIOSPrompt,
    dismissPrompt,
  };
}
