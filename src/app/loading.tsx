'use client';

/**
 * A centered, Google/Material Design style circular loading animation.
 * This appears during page transitions and initial app loads.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/50 backdrop-blur-sm pointer-events-none transition-opacity duration-300">
      <div className="relative">
        {/* The Spinner Container */}
        <svg
          className="animate-spin h-12 w-12 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          {/* Background circle (track) */}
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          ></circle>
          {/* Animated path (spinner) */}
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        
        {/* Center dot/sparkle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1.5 w-1.5 bg-accent rounded-full animate-pulse" />
        </div>
      </div>
      
      {/* Optional subtle text */}
      <div className="absolute mt-24">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 animate-pulse">
          Syncing Knowledge
        </p>
      </div>
    </div>
  );
}
