import { Header } from '@/components/Header';
import { Chat } from '@/components/Chat';

export default function Home() {
  return (
    <main className="flex flex-col h-[100dvh] bg-[#fafafa]">
      <Header />
      <Chat />
    </main>
  );
}
