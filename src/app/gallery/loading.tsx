export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero skeleton */}
      <div className="relative h-[50vh] min-h-[400px] bg-slate-100 animate-pulse motion-reduce:animate-none">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-10 w-40 mx-auto rounded-xl bg-slate-200/60 animate-pulse motion-reduce:animate-none" />
            <div className="h-4 w-64 mx-auto rounded-lg bg-slate-200/40 animate-pulse motion-reduce:animate-none [animation-delay:150ms]" />
          </div>
        </div>
      </div>

      {/* Filter skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-3 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-9 rounded-full bg-slate-100 animate-pulse motion-reduce:animate-none"
              style={{ width: `${80 + i * 20}px`, animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>

        {/* Image grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-2xl bg-slate-100 animate-pulse motion-reduce:animate-none ${
                i % 5 === 0 ? 'row-span-2 col-span-2' : 'aspect-square'
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
