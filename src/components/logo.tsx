
"use client";

import { cn } from "@/lib/utils";
import { ShieldAlert } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-primary p-1.5 rounded-lg shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
        <ShieldAlert className="h-6 w-6 text-white" />
      </div>
      <span className="text-xl font-bold tracking-tighter text-primary">HomeHero</span>
    </div>
  );
}
