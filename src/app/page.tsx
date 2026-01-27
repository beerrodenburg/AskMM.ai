'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Chat } from '@/components/Chat';
import { PWAProvider } from '@/components/PWAProvider';

export default function Home() {
  const [chatKey, setChatKey] = useState(0);

  const handleLogoClick = useCallback(() => {
    sessionStorage.removeItem('askmm-session-id');
    setChatKey(prev => prev + 1);
  }, []);

  return (
    <PWAProvider>
      <main className="flex flex-col h-[100dvh] bg-background">
        <Header onLogoClick={handleLogoClick} />
        <Chat key={chatKey} />
      </main>
    </PWAProvider>
  );
}
