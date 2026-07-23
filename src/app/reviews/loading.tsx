export default function ReviewsLoading() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero skeleton */}
      <div className="relative h-[50vh] min-h-[400px] bg-slate-100 animate-pulse motion-reduce:animate-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-10 w-48 mx-auto rounded-xl bg-slate-200/60 animate-pulse motion-reduce:animate-none" />
            <div className="h-4 w-72 mx-auto rounded-lg bg-slate-200/40 animate-pulse motion-reduce:animate-none [animation-delay:150ms]" />
          </div>
        </div>
      </div>

      {/* Stats bar skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="h-8 w-16 mx-auto rounded-lg bg-slate-100 animate-pulse motion-reduce:animate-none [animation-delay:${i * 100}ms]" />
              <div className="h-3 w-20 mx-auto rounded bg-slate-50 animate-pulse motion-reduce:animate-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Review cards skeleton */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse motion-reduce:animate-none" />
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-slate-100 animate-pulse motion-reduce:animate-none [animation-delay:100ms]" />
                  <div className="h-3 w-16 rounded bg-slate-50 animate-pulse motion-reduce:animate-none [animation-delay:150ms]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-slate-50 animate-pulse motion-reduce:animate-none [animation-delay:200ms]" />
                <div className="h-3 w-full rounded bg-slate-50 animate-pulse motion-reduce:animate-none [animation-delay:250ms]" />
                <div className="h-3 w-2/3 rounded bg-slate-50 animate-pulse motion-reduce:animate-none [animation-delay:300ms]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
