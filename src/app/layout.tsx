import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AskMM.ai - Your Health & Wellness Guide',
  description: 'Ask questions about health, nutrition, and wellness. Get answers from the Medical Medium knowledge base.',
  keywords: ['health', 'wellness', 'nutrition', 'medical medium', 'chat', 'AI'],
  openGraph: {
    title: 'AskMM.ai - Your Health & Wellness Guide',
    description: 'Ask questions about health, nutrition, and wellness.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} h-full antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
