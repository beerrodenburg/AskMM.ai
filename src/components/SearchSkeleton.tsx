export function SearchSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card overflow-hidden animate-[fadeIn_0.3s_ease-out_both]"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="skeleton aspect-video w-full rounded-none" />
          <div className="p-5">
            <div className="skeleton h-5 w-14 mb-3" />
            <div className="skeleton h-5 w-3/4 mb-2" />
            <div className="space-y-2">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-5/6" />
            </div>
            <div className="skeleton h-4 w-28 mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}
