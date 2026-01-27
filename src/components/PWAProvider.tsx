'use client';

import { usePWAInstall } from '@/hooks/usePWAInstall';
import { IOSInstallPrompt } from './IOSInstallPrompt';

interface PWAProviderProps {
  children: React.ReactNode;
}

export function PWAProvider({ children }: PWAProviderProps) {
  const { showIOSPrompt, dismissPrompt } = usePWAInstall();

  return (
    <>
      {children}
      {showIOSPrompt && <IOSInstallPrompt onDismiss={dismissPrompt} />}
    </>
  );
}
