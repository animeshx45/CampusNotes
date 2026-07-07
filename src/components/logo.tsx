
"use client";

import { cn } from "@/lib/utils";
import Image from 'next/image';
import placeholderData from "@/app/lib/placeholder-images.json";

export function Logo({ className }: { className?: string }) {
  const logoImg = placeholderData.placeholderImages.find(img => img.id === 'nitsri-logo-official');
  
  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div className="relative h-12 w-12 bg-white rounded-full shadow-lg shadow-primary/20 transition-all duration-500 group-hover:scale-110 overflow-hidden">
        <Image 
          src={logoImg?.imageUrl || "https://cdn.corenexis.com/f/4nTpHkq9UhK.png"}
          alt="NIT Srinagar Logo"
          fill
          className="object-contain"
          priority
          unoptimized
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-black tracking-tighter text-foreground transition-colors group-hover:text-primary">CampusNotes</span>
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/80 ml-0.5">NIT Srinagar</span>
      </div>
    </div>
  );
}
