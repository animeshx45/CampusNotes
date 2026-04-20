"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, UserCircle, FileText, Home, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { StudyMaterial } from '@/lib/types';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { materialService } from '@/services/material-service';
import { Logo } from '@/components/logo';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<StudyMaterial[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allMaterials, setAllMaterials] = useState<StudyMaterial[]>([]);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const auth = useAuth();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await materialService.getAllMaterials();
        setAllMaterials(data);
      } catch (e) {}
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = allMaterials.filter(m => 
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.branch.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allMaterials]);

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Logo className="h-10 w-10" />
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xl leading-none tracking-tight text-primary">CampusNotes</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">NIT Srinagar</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-accent transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link href="/browse" className="text-sm font-medium hover:text-accent transition-colors">Browse</Link>
          <Link href="/upload" className="text-sm font-medium hover:text-accent transition-colors">Upload</Link>
          <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">About</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                className="pl-9 pr-4 py-2 text-sm bg-secondary border-none rounded-full focus:ring-2 focus:ring-primary w-40 lg:w-64 transition-all"
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
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <UserCircle className="h-6 w-6 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="right" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || 'Student'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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

          <Button variant="ghost" className="md:hidden" size="icon" asChild>
            <Link href={user ? "/upload" : "/login"}>
              <UserCircle className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
