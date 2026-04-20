
"use client";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("text-primary", className)}>
      <path d="M10 40 L50 20 L90 40 L50 60 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
      <path d="M25 48 V65 C25 65 50 75 75 65 V48" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M85 40 V52" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <rect x="83" y="52" width="4" height="8" rx="1" fill="currentColor" />
      <text x="50" y="92" textAnchor="middle" fontFamily="sans-serif" fontWeight="900" fontSize="36" fill="currentColor">CN</text>
    </svg>
  );
}
