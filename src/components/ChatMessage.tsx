'use client';

import clsx from 'clsx';

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
            ? 'bg-[#10B981] text-white rounded-[20px] rounded-tr-[6px]'
            : 'bg-white text-[#262626] border border-[#e5e5e5] rounded-[20px] rounded-tl-[6px] shadow-softer'
        )}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
}
