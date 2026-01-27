'use client';

import { useEffect, useState } from 'react';

interface IOSInstallPromptProps {
  onDismiss: () => void;
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3v11.25" />
    </svg>
  );
}

function PlusSquareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export function IOSInstallPrompt({ onDismiss }: IOSInstallPromptProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for exit animation
    setTimeout(onDismiss, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Bottom Sheet Modal */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[101] transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ios-install-title"
      >
        <div className="bg-surface rounded-t-3xl shadow-2xl mx-auto max-w-lg w-full">
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-neutral-300 rounded-full" />
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 text-muted hover:text-foreground transition-colors rounded-full hover:bg-neutral-100"
            aria-label="Close install prompt"
          >
            <CloseIcon className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="px-6 pb-8 pt-2">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-sage-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl font-bold">MM</span>
              </div>
              <h2 id="ios-install-title" className="text-xl font-semibold text-foreground mb-1">
                Install AskMM.ai
              </h2>
              <p className="text-sm text-muted">
                Add to your home screen for the best experience
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-4 bg-surface-secondary rounded-xl">
                <div className="flex-shrink-0 w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                  <ShareIcon className="w-5 h-5 text-sage-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-0.5">
                    1. Tap the Share button
                  </p>
                  <p className="text-xs text-muted">
                    Find it at the bottom of your Safari browser
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-4 bg-surface-secondary rounded-xl">
                <div className="flex-shrink-0 w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                  <PlusSquareIcon className="w-5 h-5 text-sage-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-0.5">
                    2. Tap &quot;Add to Home Screen&quot;
                  </p>
                  <p className="text-xs text-muted">
                    Scroll down in the share menu if needed
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-4 bg-surface-secondary rounded-xl">
                <div className="flex-shrink-0 w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center">
                  <span className="text-sage-600 font-semibold text-sm">Add</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground mb-0.5">
                    3. Tap &quot;Add&quot; to confirm
                  </p>
                  <p className="text-xs text-muted">
                    You can rename it if you like
                  </p>
                </div>
              </div>
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="w-full mt-6 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              Maybe later
            </button>
          </div>

          {/* Safe area padding for notch devices */}
          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
      </div>
    </>
  );
}
