
"use client";

import { cn } from "@/lib/utils";
import { ShieldCheck } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary p-2 rounded-xl shadow-lg rotate-3 group-hover:rotate-0 transition-all duration-300">
        <ShieldCheck className="h-7 w-7 text-white" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-black tracking-tighter text-primary">HomeHero</span>
        <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-muted-foreground ml-0.5">Verified Pros</span>
      </div>
    </div>
  );
}
