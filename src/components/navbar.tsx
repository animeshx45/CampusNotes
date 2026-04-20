
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Upload, BookOpen, GraduationCap } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="bg-primary p-1.5 rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xl leading-tight tracking-tight text-primary">NIT StudySync</span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Srinagar Official Portal</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/browse" className="text-sm font-medium hover:text-accent transition-colors">Browse</Link>
          <Link href="/upload" className="text-sm font-medium hover:text-accent transition-colors">Upload</Link>
          <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">About NIT</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search notes..."
              className="pl-9 pr-4 py-2 text-sm bg-secondary border-none rounded-full focus:ring-2 focus:ring-primary w-40 lg:w-48 transition-all"
            />
          </div>
          <ThemeToggle />
          <Button asChild variant="default" className="hidden sm:flex rounded-full px-6">
            <Link href="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Contribute
            </Link>
          </Button>
          <Button variant="ghost" className="md:hidden" size="icon">
            <BookOpen className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
