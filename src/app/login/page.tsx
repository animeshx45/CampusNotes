
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Welcome back!", description: "Successfully logged in." });
      router.push('/browse');
    } catch (error: any) {
      toast({ 
        title: "Login Failed", 
        description: error.message || "Invalid email or password.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="text-center space-y-4">
          <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto p-2">
            <Logo className="h-full w-full" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your CampusNotes account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email" 
                  placeholder="name@nitsri.ac.in" 
                  className="pl-10" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold">Password</label>
                <Link href="#" className="text-xs text-accent hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              Sign In
            </Button>
          </form>

          <div className="relative text-center">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
            <span className="relative bg-white dark:bg-card px-2 text-xs text-muted-foreground uppercase font-bold">New here?</span>
          </div>

          <Button variant="outline" className="w-full h-12 rounded-xl border-primary/20" asChild>
            <Link href="/signup">
              Create an account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
