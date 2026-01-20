'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { StarterPrompts } from './StarterPrompts';
import { TypingIndicator } from './TypingIndicator';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('askmm-session-id');
      if (stored) return stored;
      const newId = crypto.randomUUID();
      sessionStorage.setItem('askmm-session-id', newId);
      return newId;
    }
    return crypto.randomUUID();
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response || 'Sorry, I could not generate a response.',
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sessionId]);

  const handleSend = useCallback(() => {
    sendMessage(inputValue);
  }, [inputValue, sendMessage]);

  const handleStarterSelect = useCallback((prompt: string) => {
    sendMessage(prompt);
  }, [sendMessage]);

  const handleRetry = useCallback(() => {
    setError(null);
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMessage) {
        setMessages(prev => prev.filter(m => m.id !== lastUserMessage.id));
        sendMessage(lastUserMessage.content);
      }
    }
  }, [messages, sendMessage]);

  const showWelcome = messages.length === 0 && !isLoading;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-3xl mx-auto px-4 py-6">
          {showWelcome ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <StarterPrompts onSelect={handleStarterSelect} />
            </div>
          ) : (
            <div className="flex flex-col gap-4" role="log" aria-live="polite">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                />
              ))}

              {isLoading && <TypingIndicator />}

              {error && (
                <div className="flex justify-center animate-fade-in">
                  <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-3">
                    <span>{error}</span>
                    <button
                      onClick={handleRetry}
                      className="text-red-600 hover:text-red-800 font-medium underline underline-offset-2"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSend}
        disabled={isLoading}
      />
    </div>
  );
}
