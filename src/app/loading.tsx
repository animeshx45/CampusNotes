
'use client';

/**
 * A minimal, YouTube-style top loading progress bar.
 * This appears fixed at the very top of the viewport during page transitions.
 */
export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full z-[9999] pointer-events-none">
      {/* Progress Bar Container */}
      <div className="h-[3px] w-full bg-primary/20 overflow-hidden">
        {/* Sliding Progress Line */}
        <div className="h-full bg-primary animate-youtube-loading shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
      </div>

      <style jsx global>{`
        @keyframes youtube-loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(-30%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-youtube-loading {
          animation: youtube-loading 2s infinite linear;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
