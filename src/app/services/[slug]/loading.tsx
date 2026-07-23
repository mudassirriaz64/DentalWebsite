export default function ServiceDetailLoading() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero skeleton */}
      <div className="relative h-[60vh] min-h-[480px] bg-slate-100 animate-pulse motion-reduce:animate-none">
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto w-full px-6 pb-16 space-y-4">
            <div className="h-4 w-32 rounded-lg bg-slate-200/60 animate-pulse motion-reduce:animate-none" />
            <div className="h-12 w-80 rounded-xl bg-slate-200/60 animate-pulse motion-reduce:animate-none [animation-delay:100ms]" />
            <div className="h-4 w-64 rounded-lg bg-slate-200/40 animate-pulse motion-reduce:animate-none [animation-delay:200ms]" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-slate-100 animate-pulse motion-reduce:animate-none [animation-delay:100ms]" />
          <div className="h-4 w-full rounded bg-slate-100 animate-pulse motion-reduce:animate-none [animation-delay:150ms]" />
          <div className="h-4 w-3/4 rounded bg-slate-100 animate-pulse motion-reduce:animate-none [animation-delay:200ms]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 rounded-2xl bg-slate-50 animate-pulse motion-reduce:animate-none [animation-delay:250ms]" />
          <div className="h-24 rounded-2xl bg-slate-50 animate-pulse motion-reduce:animate-none [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}
