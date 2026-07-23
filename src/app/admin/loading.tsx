export default function AdminLoading() {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-800 overflow-hidden h-full">
      <main className="flex-grow flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col font-sans p-6 text-sm">
          {/* Header skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-7 w-48 bg-slate-200 rounded-xl animate-pulse" />
              <div className="h-3 w-72 bg-slate-100 rounded-lg animate-pulse mt-2" />
            </div>
            <div className="h-10 w-28 bg-slate-200 rounded-xl animate-pulse" />
          </div>

          {/* Filter bar skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm">
            <div className="h-9 w-64 bg-slate-100 rounded-xl animate-pulse" />
          </div>

          {/* Table skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col flex-1">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50/75 border-b border-slate-100">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="col-span-2">
                  <div className="h-3 bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Table rows */}
            {Array.from({ length: 5 }).map((_, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-slate-50"
              >
                {Array.from({ length: 6 }).map((_, colIdx) => (
                  <div key={colIdx} className="col-span-2 flex items-center gap-2">
                    <div className="h-3 bg-slate-100 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
