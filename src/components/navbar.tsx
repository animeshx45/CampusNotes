
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Search, UserCircle, Home, LogOut, Menu, X, Hammer, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useUser, useAuth } from '@/firebase';
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

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const navLinks = [
    { name: 'Find Services', href: '/browse', icon: Search },
    { name: 'Join as Worker', href: '/worker/register', icon: Hammer },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-2"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <UserCircle className="h-7 w-7 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="right">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{user.displayName || 'Hero'}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  My Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="ghost" className="rounded-xl font-bold">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="rounded-xl font-bold px-6 shadow-lg shadow-primary/20">
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
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-bold p-3 hover:bg-primary/5 rounded-xl transition-colors flex items-center gap-3"
                    >
                      <link.icon className="h-5 w-5 text-primary" />
                      {link.name}
                    </Link>
                  ))}
                  <div className="border-t pt-4 flex flex-col gap-2">
                    {!user ? (
                      <>
                        <Button asChild className="w-full rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                          <Link href="/signup">Create Account</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                          <Link href="/login">Sign In</Link>
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
