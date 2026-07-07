'use client';

/**
 * A non-blocking, centered loading animation.
 * pointer-events-none ensures users can still interact with the page if it's finishing a fade.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/40 backdrop-blur-md pointer-events-none animate-in fade-in duration-300">
      <div className="relative flex flex-col items-center gap-8">
        {/* The Spinner Container */}
        <div className="relative h-16 w-16">
          <svg
            className="animate-spin h-full w-full text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-10"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            ></circle>
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          
          {/* Center Sparkle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-accent rounded-full animate-pulse shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
          </div>
        </div>
        
        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/80 animate-pulse">
          Optimizing Portal
        </p>
      </div>
    </div>
  );
}
