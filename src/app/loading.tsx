
'use client';

import { Logo } from '@/components/logo';
import { BookOpen, Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center gap-8 animate-in fade-in duration-500">
      {/* Central Animation Hub */}
      <div className="relative h-32 w-32 flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <div className="absolute inset-0 rounded-[2.5rem] border-2 border-primary/20 animate-ping opacity-20" />
        
        {/* Rotating Knowledge Ring */}
        <div className="absolute inset-0 rounded-[2rem] border-t-2 border-l-2 border-primary animate-spin [animation-duration:1.5s]" />
        
        {/* Secondary Decorative Ring */}
        <div className="absolute inset-4 rounded-full border-r-2 border-accent animate-spin [animation-duration:2.5s] [animation-direction:reverse]" />
        
        {/* Logo Container */}
        <div className="relative bg-card p-4 rounded-2xl shadow-2xl border border-primary/10">
          <Logo className="scale-75" />
        </div>
      </div>

      {/* Loading Text & Status */}
      <div className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Sparkles className="h-4 w-4 animate-pulse" />
          <h2 className="text-sm font-black uppercase tracking-[0.3em] font-headline">Syncing Knowledge</h2>
          <Sparkles className="h-4 w-4 animate-pulse" />
        </div>
        <p className="text-muted-foreground text-xs font-medium max-w-[200px] leading-relaxed italic opacity-60">
          Preparing your academic repository...
        </p>
      </div>

      {/* Subtle Progress Bar */}
      <div className="w-48 h-1 bg-primary/10 rounded-full overflow-hidden relative shadow-inner">
        <div className="absolute inset-0 bg-primary w-1/3 rounded-full animate-loader-slide" />
      </div>

      <style jsx global>{`
        @keyframes loader-slide {
          0% { left: -40%; width: 30%; }
          50% { width: 60%; }
          100% { left: 110%; width: 30%; }
        }
        .animate-loader-slide {
          animation: loader-slide 1.8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
