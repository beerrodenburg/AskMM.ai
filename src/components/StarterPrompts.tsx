'use client';

interface StarterPromptsProps {
  onSelect: (prompt: string) => void;
}

const PROMPTS = [
  'How did AW learn to do light blasts?',
  'Squirrels?',
  'What does AW say about AI?',
  'How to avoid bird flu?',
];

export function StarterPrompts({ onSelect }: StarterPromptsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="text-center mb-8 animate-fade-in">
        <h2 className="text-2xl font-semibold text-[#262626] mb-2">
          Welcome to AskMM.ai
        </h2>
        <p className="text-[#737373] text-[15px]">
          Ask questions and receive answers sourced directly from Medical Medium livestream discussions
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PROMPTS.map((prompt, index) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            className="w-full text-left p-4 bg-white rounded-xl border-l-[3px] border-l-[#10B981] shadow-softer hover:shadow-soft hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 animate-slide-up"
            style={{
              animationDelay: `${index * 75}ms`,
              animationFillMode: 'backwards',
            }}
          >
            <span className="text-sm text-[#404040] leading-relaxed">
              {prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
