
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, LogOut, Menu, BookOpen, Upload, LayoutDashboard, MessageSquare, Bell, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
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
import { collection, query, where, limit } from 'firebase/firestore';
import { User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  const userProfileQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users'), where('id', '==', user.uid), limit(1));
  }, [db, user]);

  const { data: profiles } = useCollection<User>(userProfileQuery);
  const profile = profiles?.[0];
  const isAdmin = profile?.role === 'admin';

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const navLinks = [
    { name: 'See Notes', href: '/browse', icon: Search },
    { name: 'Chat', href: '/forum', icon: MessageSquare },
    { name: 'About Us', href: '/about', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <Logo className="scale-90 origin-left" />
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="text-xs font-black uppercase tracking-widest hover:text-primary transition-all flex items-center gap-2 group/link"
            >
              <link.icon className="h-3.5 w-3.5 text-primary/70 group-hover/link:text-primary group-hover/link:scale-110 transition-transform" />
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/notifications" className="p-2.5 hover:bg-secondary rounded-xl relative group transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 bg-accent rounded-full shadow-lg" />
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-xl p-0 overflow-hidden hover:scale-105 transition-transform shadow-sm">
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                      {user.displayName?.charAt(0) || 'S'}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 rounded-2xl p-2 shadow-2xl border-primary/5" align="right">
                  <DropdownMenuLabel className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black tracking-tight">{user.displayName || 'Student'}</span>
                      <span className="text-[10px] text-muted-foreground truncate">{user.email}</span>
                      {isAdmin && <Badge className="mt-2 w-fit bg-primary text-[8px] px-2 py-0 font-black tracking-widest">ADMIN</Badge>}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/5" />
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/admin')} className="rounded-xl p-3 font-bold cursor-pointer text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
                      <ShieldCheck className="mr-3 h-4 w-4" /> Admin Portal
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push('/dashboard')} className="rounded-xl p-3 font-bold cursor-pointer hover:bg-secondary transition-colors">
                    <LayoutDashboard className="mr-3 h-4 w-4" /> My Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/upload')} className="rounded-xl p-3 font-bold cursor-pointer hover:bg-secondary transition-colors">
                    <Upload className="mr-3 h-4 w-4" /> Share Notes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/5" />
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl p-3 font-bold cursor-pointer text-destructive hover:bg-destructive/5 transition-colors">
                    <LogOut className="mr-3 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="ghost" className="rounded-xl font-bold text-sm h-10 px-5">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="rounded-xl font-black text-xs uppercase tracking-widest h-10 px-6 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

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
                  {isAdmin && (
                    <Link 
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-base font-bold p-4 bg-primary/10 text-primary rounded-2xl flex items-center gap-3 shadow-sm"
                    >
                      <ShieldCheck className="h-5 w-5" /> Admin Portal
                    </Link>
                  )}
                  <Link 
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-bold p-4 bg-secondary/50 rounded-2xl flex items-center gap-3"
                  >
                    <LayoutDashboard className="h-5 w-5" /> Dashboard
                  </Link>
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
                    {!user ? (
                      <>
                        <Button asChild className="w-full rounded-2xl h-14 font-black text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                          <Link href="/signup">Sign Up</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full rounded-2xl h-14 font-black text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                          <Link href="/login">Login</Link>
                        </Button>
                      </>
                    ) : (
                      <Button variant="destructive" className="w-full rounded-2xl h-14 font-black text-lg" onClick={handleLogout}>
                        <LogOut className="h-5 w-5 mr-3" /> Log Out
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
