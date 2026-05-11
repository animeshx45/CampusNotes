"use client";

import { cn } from "@/lib/utils";
import { GraduationCap } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/20 transition-all duration-500 group-hover:rotate-12">
        <GraduationCap className="h-8 w-8 text-primary-foreground" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-black tracking-tighter text-foreground transition-colors group-hover:text-primary">CampusNotes</span>
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/80 ml-0.5">NIT Srinagar</span>
      </div>
    </div>
  );
}