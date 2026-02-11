import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-12 animate-[fadeIn_0.4s_ease-out]">
      <AlertCircle
        size={40}
        className="mx-auto mb-4 text-[var(--color-error)]"
        strokeWidth={1.5}
      />
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
        Something went wrong
      </h3>
      <p className="text-sm text-[var(--muted)] max-w-sm mx-auto mb-5">
        We couldn&apos;t complete your search. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors cursor-pointer"
      >
        <RotateCcw size={14} />
        Try again
      </button>
    </div>
  );
}
