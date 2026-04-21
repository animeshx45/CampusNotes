
"use client";

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, UserCircle, FileText, Home, LogOut, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { StudyMaterial } from '@/lib/types';
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { collection, query, orderBy } from 'firebase/firestore';
import { Logo } from '@/components/logo';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  const materialsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'studyMaterials'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: allMaterials } = useCollection<StudyMaterial>(materialsQuery);

  const suggestions = useMemo(() => {
    if (!allMaterials || searchQuery.trim().length <= 1) return [];
    return allMaterials.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.branch.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);
  }, [searchQuery, allMaterials]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Browse', href: '/browse' },
    { name: 'Upload', href: '/upload' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Logo className="h-8 w-8 md:h-10 md:w-10" />
            <div className="flex flex-col">
              <span className="font-headline font-bold text-lg md:text-xl leading-none tracking-tight text-primary">CampusNotes</span>
              <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">NIT Srinagar</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1"
            >
              {link.icon && <link.icon className="h-4 w-4" />} {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
          <div className="hidden sm:flex relative flex-1 max-w-[260px]" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                className="pl-9 pr-4 py-2 text-sm bg-secondary border-none rounded-full focus:ring-2 focus:ring-primary w-full transition-all"
              />
            </form>
            
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-card border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 border-b bg-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Suggestions
                </div>
                <div className="divide-y">
                  {suggestions.map((material) => (
                    <button
                      key={material.id}
                      onClick={() => {
                        router.push(`/material/${material.id}`);
                        setShowSuggestions(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-3 hover:bg-secondary transition-colors flex items-start gap-3"
                    >
                      <div className="bg-primary/10 p-1.5 rounded-lg shrink-0">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold truncate">{material.title}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{material.branch}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full focus-visible:ring-0">
                  <UserCircle className="h-6 w-6 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="right" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'Student'}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/upload')}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>My Contributions</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="ghost" className="rounded-full">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="default" className="rounded-full px-6">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left font-headline font-bold text-primary">Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium p-2 hover:bg-primary/10 rounded-xl transition-colors flex items-center gap-3"
                    >
                      {link.icon ? <link.icon className="h-5 w-5" /> : <div className="w-5 h-5" />}
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-t pt-4 mt-2">
                    {!user ? (
                      <div className="flex flex-col gap-2">
                        <Button asChild className="w-full rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                          <Link href="/signup">Create Account</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                          <Link href="/login">Sign In</Link>
                        </Button>
                      </div>
                    ) : (
                      <Button variant="destructive" className="w-full rounded-xl" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                        <LogOut className="h-4 w-4 mr-2" /> Log Out
                      </Button>
                    )}
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
