export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero skeleton */}
      <div className="relative h-[50vh] min-h-[400px] bg-slate-100 animate-pulse motion-reduce:animate-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-10 w-64 mx-auto rounded-xl bg-slate-200/60 animate-pulse motion-reduce:animate-none" />
            <div className="h-4 w-96 mx-auto rounded-lg bg-slate-200/40 animate-pulse motion-reduce:animate-none [animation-delay:150ms]" />
          </div>
        </div>
      </div>

      {/* Service cards skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100 bg-white p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 animate-pulse motion-reduce:animate-none" />
              <div className="h-5 w-3/4 rounded-lg bg-slate-100 animate-pulse motion-reduce:animate-none [animation-delay:100ms]" />
              <div className="space-y-2">
                <div className="h-3 w-full rounded bg-slate-50 animate-pulse motion-reduce:animate-none [animation-delay:200ms]" />
                <div className="h-3 w-5/6 rounded bg-slate-50 animate-pulse motion-reduce:animate-none [animation-delay:250ms]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
