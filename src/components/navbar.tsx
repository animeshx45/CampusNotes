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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2"
            >
              <link.icon className="h-4 w-4 text-primary" />
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/notifications" className="p-2 hover:bg-secondary rounded-full relative group">
                <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full" />
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {user.displayName?.charAt(0) || 'S'}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-2xl p-2" align="right">
                  <DropdownMenuLabel className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{user.displayName || 'Student'}</span>
                      <span className="text-[10px] text-muted-foreground">{user.email}</span>
                      {isAdmin && <Badge className="mt-2 w-fit bg-primary text-[8px] px-2 py-0">ADMIN</Badge>}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => router.push('/admin')} className="rounded-xl p-3 font-bold cursor-pointer text-primary bg-primary/5">
                      <ShieldCheck className="mr-2 h-4 w-4" /> Admin Portal
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push('/dashboard')} className="rounded-xl p-3 font-bold cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" /> My Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/upload')} className="rounded-xl p-3 font-bold cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" /> Share Notes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl p-3 font-bold cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="ghost" className="rounded-xl font-bold">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="rounded-xl font-bold px-6 shadow-md">
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
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-8">
                  {isAdmin && (
                    <Link 
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-bold p-3 bg-primary/10 text-primary rounded-xl flex items-center gap-3"
                    >
                      <ShieldCheck className="h-5 w-5" /> Admin Portal
                    </Link>
                  )}
                  <Link 
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-bold p-3 bg-secondary/50 rounded-xl flex items-center gap-3"
                  >
                    <LayoutDashboard className="h-5 w-5" /> Dashboard
                  </Link>
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-bold p-3 hover:bg-primary/5 rounded-xl flex items-center gap-3"
                    >
                      <link.icon className="h-5 w-5 text-primary" />
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-t pt-4 flex flex-col gap-2">
                    {!user ? (
                      <>
                        <Button asChild className="w-full rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                          <Link href="/signup">Sign Up</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                          <Link href="/login">Login</Link>
                        </Button>
                      </>
                    ) : (
                      <Button variant="destructive" className="w-full rounded-xl" onClick={handleLogout}>
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
