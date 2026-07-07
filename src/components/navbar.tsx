
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, Menu, BookOpen, Upload, LayoutDashboard, MessageSquare } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const navLinks = [
    { name: 'See Notes', href: '/browse', icon: Search },
    { name: 'Community Forum', href: '/forum', icon: MessageSquare },
    { name: 'Upload', href: '/upload', icon: Upload },
    { name: 'Activity Hub', href: '/dashboard', icon: LayoutDashboard },
    { name: 'About', href: '/about', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <Logo className="scale-90 origin-left" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="text-[10px] font-black uppercase tracking-widest hover:text-primary transition-all flex items-center gap-2 group/link"
            >
              <link.icon className="h-3.5 w-3.5 text-primary/70 group-hover/link:text-primary group-hover/link:scale-110 transition-transform" />
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="hidden sm:flex items-center gap-2">
            <Button asChild className="rounded-xl font-black text-[10px] uppercase tracking-widest h-10 px-6 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              <Link href="/upload">Share Material</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="rounded-l-[2.5rem]">
                <SheetHeader>
                  <SheetTitle className="text-left font-headline font-bold text-2xl pt-4">Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-3 mt-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-base font-bold p-4 hover:bg-primary/5 rounded-2xl flex items-center gap-3 transition-colors"
                    >
                      <link.icon className="h-5 w-5 text-primary" />
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-t border-primary/5 pt-6 flex flex-col gap-3">
                    <Button asChild className="w-full rounded-2xl h-14 font-black text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/upload">Upload Now</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
