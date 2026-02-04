'use client';

import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Header } from '@/components/Header';

const content = `# About AskMM.ai

Welcome! If you're here, you're probably curious about how [AskMM.ai](http://askmm.ai/) works and what it can do for you. Let me walk you through it.

---

## What Is AskMM.ai?

**AskMM.ai is a search tool that helps you find specific information across Medical Medium's YouTube content.**

Think of it like a librarian who has watched every single Medical Medium video and can instantly tell you which video and exact timestamp contains the answer to your question.

When you ask something like "what does AW say about healing vitiligo?", the tool searches through hundreds of hours of content and shows you the exact moments where he discusses that topic—complete with direct links and timestamps to his actual words.

---

## How It Works?

AskMM.ai uses AI (artificial intelligence) to search through content from Medical Medium's YouTube channel.

The AI has access to a database where I upload transcripts from Anthony William's YouTube videos. All content comes exclusively from Anthony William's official channel, and the database updates automatically every day when new content is posted.

When you type a question, the AI reads what you're asking and understands the meaning behind it. For example, if you ask "what does AW say about itchy red skin?", the AI will also find videos where Anthony discusses "dermatitis" or "eczema", even if he doesn't use the exact phrase "itchy red skin".

It then shows you a summary of what Anthony William said (pulled from the original video transcript), along with direct links to the videos with specific timestamps. If a topic is discussed in multiple videos, you'll see several sources.

You can click the timestamped link to watch the clip and hear Anthony William's actual words in their full context.

---

## Why There's a Disclaimer

You'll notice every search result includes this message:

> "AI can make mistakes. Please click the linked sources to verify the information yourself."

Here's why I include that:

**Speech-to-text technology isn't perfect.** When videos are transcribed, sometimes words get misheard.

**The AI works with limited context.** To generate summaries, the AI analyzes portions of the video rather than the entire video. This means it might miss important context from earlier or later in the conversation that would change the meaning.

**The AI takes everything literally.** It may not understand sarcasm, humor, or indirect references. If Anthony William is being sarcastic or making an ironic point, the AI might interpret it as straightforward information.

**This is a finding tool, not a replacement for the source.** The whole point is to direct you TO Anthony William's content, not to replace it. You should always click through and watch the actual clip to hear his exact words in context.

I'd rather be upfront about limitations than have you think this is 100% foolproof. It's not. But it's really useful.

---

## About The Creator

Hi, I'm Beer (yes, that's my real name, though I prefer celery juice). I'm a 22-year-old from the Netherlands.

My mom introduced me to Medical Medium back in 2018 when she was dealing with chronic illness. I started diving deep into the information myself in 2023, and it changed my life.

Here's the thing: Anthony William has produced SO much content over the years. Hundreds of livestreams, podcasts, videos... it's incredible, but it can also be overwhelming. I'd find myself thinking, "I know he talked about this somewhere, but which video was it in? And where in that 2-hour livestream?" I recently started learning about AI and realized I could build something to solve this exact problem.

What really moved me was when someone in the community told me this tool helps people with severe brain fog who can't watch full podcasts or streams but still want to know what Medical Medium says about certain topics. That's exactly the kind of impact I was hoping to have.

---

## Get in Touch

I'd love to hear from you! Whether you have suggestions, found an issue, or just want to share how the tool has helped you:

**Email me:** [beerrodenburg@gmail.com](mailto:beerrodenburg@gmail.com)

**Whatsapp:** +31 6 15 35 08 96

Thank you for taking the time to understand how this tool works. I hope it helps you on your healing journey.

— Beer`;

export default function AboutPage() {
  return (
    <main className="flex flex-col h-[100dvh] bg-background">
      <Header />
      <div className="flex-1 overflow-y-auto">
        <article className="max-w-3xl mx-auto px-4 py-8">
          <div className="prose prose-sm max-w-none prose-p:my-3 prose-headings:my-4 prose-ul:my-3 prose-ol:my-3 prose-li:my-0.5 prose-hr:my-6 prose-blockquote:my-4 prose-blockquote:border-sage-500 prose-blockquote:text-muted prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-sage-500 prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          <div className="mt-8 mb-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage-500 text-white rounded-full hover:bg-sage-600 transition-colors text-sm font-medium"
            >
              Start chatting
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
