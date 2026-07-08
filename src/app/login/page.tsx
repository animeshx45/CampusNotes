"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, KeyRound, Mail, Sparkles, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({ title: "Error", description: "Email and password are required.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password.trim());
      toast({ title: "Welcome back!", description: "You have logged in successfully." });
      router.push('/dashboard');
    } catch (err: any) {
      toast({ 
        title: "Login Failed", 
        description: err.message || "Invalid email or password.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration radial glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <Card className="w-full max-w-md border-white/5 bg-zinc-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap className="h-16 w-16 text-primary" />
        </div>

        <CardHeader className="space-y-3 p-8 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-1">
              <Sparkles className="h-3 w-3 animate-pulse" /> STUDENT PORTAL
            </span>
          </div>
          <CardTitle className="text-4xl font-headline font-bold text-primary tracking-tighter">
            Welcome <br />Back.
          </CardTitle>
          <CardDescription className="text-zinc-400 font-medium">
            Sign in to access study materials, notes, and discussions.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input 
                  id="email"
                  type="email"
                  placeholder="name@nitsri.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-950 border-white/15 text-white rounded-xl h-12 pl-11 focus-visible:ring-primary focus-visible:ring-1"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-950 border-white/15 text-white rounded-xl h-12 pl-11 focus-visible:ring-primary focus-visible:ring-1"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 mt-6 shadow-xl flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="p-8 pt-0 border-t border-white/5 justify-center mt-2 flex flex-col gap-2">
          <p className="text-sm text-zinc-400 mt-4">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary font-bold hover:underline">
              Sign Up
            </Link>
          </p>
          <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Back to Home
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
