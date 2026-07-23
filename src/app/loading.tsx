export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg">
      {/* Branded spinner */}
      <div className="relative mb-8">
        {/* Pulsing ring */}
        <div className="absolute inset-0 w-20 h-20 rounded-full bg-primary/10 animate-ping motion-reduce:animate-none" />
        {/* Tooth icon */}
        <div className="relative w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center border border-slate-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-8 h-8 text-primary animate-pulse motion-reduce:animate-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C9.5 2 7.5 3.5 7 5.5C6.5 7.5 5 9 4 11C3 13 3.5 16 5 18C6 19.5 7 21 8 22C8.5 22.5 9 22 9 21.5C9 20 9.5 18 10 16.5C10.5 15 11 14 12 14C13 14 13.5 15 14 16.5C14.5 18 15 20 15 21.5C15 22 15.5 22.5 16 22C17 21 18 19.5 19 18C20.5 16 21 13 20 11C19 9 17.5 7.5 17 5.5C16.5 3.5 14.5 2 12 2Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Subtle brand text */}
      <p className="text-sm font-semibold text-slate-400 tracking-wide">
        Loading...
      </p>

      {/* Content skeleton hint — approximate page structure to minimize layout shift */}
      <div className="w-full max-w-6xl px-6 mt-16 space-y-8">
        {/* Hero-shaped skeleton */}
        <div className="h-80 rounded-3xl bg-slate-100/60 animate-pulse motion-reduce:animate-none" />
        {/* Card row skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-48 rounded-2xl bg-slate-100/40 animate-pulse motion-reduce:animate-none [animation-delay:150ms]" />
          <div className="h-48 rounded-2xl bg-slate-100/40 animate-pulse motion-reduce:animate-none [animation-delay:300ms]" />
          <div className="h-48 rounded-2xl bg-slate-100/40 animate-pulse motion-reduce:animate-none [animation-delay:450ms]" />
        </div>
      </div>
    </div>
  );
}
