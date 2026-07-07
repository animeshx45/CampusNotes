"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Home as HomeIcon, Users, Info, Mail, Upload, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
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
        ? "bg-background/80 backdrop-blur-3xl py-2 border-primary/10 shadow-2xl" 
        : "bg-transparent py-4 border-transparent"
    )}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <Logo className={cn("transition-transform duration-500 origin-left", isScrolled ? "scale-90" : "scale-100")} />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-all flex items-center gap-2 group/link"
            >
              <link.icon className="h-4 w-4 opacity-50 group-hover/link:opacity-100 group-hover/link:scale-110 transition-all" />
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="hidden sm:flex items-center gap-3">
            <Button asChild className="rounded-2xl font-black text-[10px] uppercase tracking-widest h-12 px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-all bg-primary border-none">
              <Link href="/upload" className="flex items-center gap-2">Share Material <ChevronRight className="h-3 w-3" /></Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl h-11 w-11 bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-all">
                  <Menu className="h-6 w-6 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent className="rounded-l-[3rem] border-primary/10 bg-background/95 backdrop-blur-3xl p-10">
                <SheetHeader>
                  <SheetTitle className="text-left font-headline font-bold text-3xl pt-4 text-primary tracking-tighter">Gateway.</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-12">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-xl font-bold p-6 hover:bg-primary/5 rounded-[2rem] flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <link.icon className="h-6 w-6 text-primary/60 group-hover:text-primary" />
                        {link.name}
                      </div>
                      <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ))}
                  <div className="border-t border-primary/10 pt-10 mt-6 flex flex-col gap-4">
                    <Button asChild className="w-full rounded-[2rem] h-20 font-black text-xl bg-primary shadow-2xl shadow-primary/20" onClick={() => setIsMobileMenuOpen(false)}>
                      <Link href="/upload">Share Material</Link>
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
