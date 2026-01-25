'use client';

import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div
      className={clsx(
        'flex w-full animate-slide-up',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={clsx(
          'max-w-[80%] px-4 py-3 text-[15px] leading-[1.6]',
          isUser
            ? 'bg-sage-500 text-white rounded-[20px] rounded-tr-[6px]'
            : 'bg-surface text-foreground border border-neutral-200 rounded-[20px] rounded-tl-[6px] shadow-softer'
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-sage-500 prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
