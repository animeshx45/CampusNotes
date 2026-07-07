"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Home as HomeIcon, Users, Info, Mail, ChevronRight, X } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Community', href: '/forum', icon: Users },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact Us', href: '/contact', icon: Mail },
  ];

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-500 border-b",
      isScrolled 
        ? "bg-background/60 backdrop-blur-3xl py-1 md:py-2 border-white/10 shadow-2xl" 
        : "bg-transparent py-2 md:py-4 border-transparent"
    )}>
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <Logo className={cn("transition-transform duration-500 origin-left", isScrolled ? "scale-90" : "scale-100")} />
        </Link>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-all flex items-center gap-2 group/link"
            >
              <link.icon className="h-4 w-4 opacity-50 group-hover/link:opacity-100 group-hover/link:scale-110 transition-all" />
              <span className="hidden lg:inline">{link.name}</span>
              <span className="lg:hidden">{link.name.split(' ')[0]}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <Button asChild className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-10 md:h-12 px-6 md:px-8 shadow-xl backdrop-blur-xl bg-primary/90 hover:bg-primary border border-white/10 hover:scale-105 transition-all">
              <Link href="/upload" className="flex items-center gap-2">Share <ChevronRight className="h-3 w-3" /></Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 bg-white/5 backdrop-blur-xl hover:bg-white/10 border border-white/10 transition-all">
                  <Menu className="h-5 w-5 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-[400px] rounded-l-[2rem] border-white/10 bg-background/95 backdrop-blur-3xl p-6 md:p-10 flex flex-col">
                <SheetHeader className="mb-8">
                  <SheetTitle className="text-left font-headline font-bold text-3xl text-primary tracking-tighter">Menu.</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 overflow-y-auto flex-grow pr-2">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-bold p-5 hover:bg-white/5 rounded-2xl flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <link.icon className="h-6 w-6 text-primary/60 group-hover:text-primary" />
                        {link.name}
                      </div>
                      <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ))}
                </div>
                <div className="border-t border-white/10 pt-6 mt-auto">
                  <Button asChild className="w-full rounded-2xl h-16 font-black text-lg bg-primary/90 shadow-2xl backdrop-blur-xl border border-white/10" onClick={() => setIsMobileMenuOpen(false)}>
                    <Link href="/upload">Share Material</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
