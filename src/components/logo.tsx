
"use client";

import { cn } from "@/lib/utils";
import Image from 'next/image';
import placeholderData from "@/app/lib/placeholder-images.json";

export function Logo({ className }: { className?: string }) {
  const logoImg = placeholderData.placeholderImages.find(img => img.id === 'nitsri-logo-official');
  
  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div className="relative h-12 w-12 bg-white rounded-full p-1 shadow-lg shadow-primary/20 transition-all duration-500 group-hover:scale-110 overflow-hidden">
        <Image 
          src={logoImg?.imageUrl || "https://tse1.mm.bing.net/th?id=OIP.7xU4w2l7_8Y8yL7G9X6zYQHaHa&pid=Api"}
          alt="NIT Srinagar Logo"
          fill
          className="object-contain p-1"
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
