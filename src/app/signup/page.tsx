
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Lock, User, ArrowRight, Loader2, GraduationCap, Briefcase, Shield } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { BRANCHES, SEMESTERS } from '@/lib/mock-data';
import { Branch, UserRole, Semester } from '@/lib/types';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [branch, setBranch] = useState<Branch | ''>('');
  const [semester, setSemester] = useState<Semester | ''>('');
  
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      const userRef = doc(db, 'users', userCredential.user.uid);
      setDocumentNonBlocking(userRef, {
        id: userCredential.user.uid,
        fullName: name,
        email,
        username: email.split('@')[0],
        role,
        branch: branch || null,
        semester: semester || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, {});

      toast({ title: "Account Created!", description: `Welcome to CampusNotes.` });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ 
        title: "Signup Failed", 
        description: error.message || "Failed to create account.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 flex justify-center items-center">
      <Card className="w-full max-w-xl shadow-2xl border-none rounded-[2.5rem] overflow-hidden">
        <CardHeader className="text-center space-y-4 bg-primary text-primary-foreground p-10">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto p-2">
            <Logo className="h-full w-full" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold">Join the Vault</CardTitle>
          <CardDescription className="text-primary-foreground/80">Start your academic journey with fellow NITians</CardDescription>
        </CardHeader>
        <CardContent className="p-10 space-y-6 bg-card">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Animesh Kumar" className="pl-10 h-11 rounded-xl" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input type="email" placeholder="student@nitsri.ac.in" className="pl-10 h-11 rounded-xl" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">I am a...</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'student', label: 'Student', icon: GraduationCap },
                  { id: 'teacher', label: 'Teacher', icon: Briefcase },
                  { id: 'admin', label: 'Admin', icon: Shield },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as UserRole)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${role === r.id ? 'border-primary bg-primary/5 text-primary' : 'border-muted hover:border-primary/20'}`}
                  >
                    <r.icon className="h-6 w-6" />
                    <span className="text-[10px] font-black uppercase tracking-tight">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {role === 'student' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Department</label>
                  <Select onValueChange={(v) => setBranch(v as Branch)} required>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Semester</label>
                  <Select onValueChange={(v) => setSemester(parseInt(v) as Semester)} required>
                    <SelectTrigger className="h-11 rounded-xl">
                      <SelectValue placeholder="Current Sem" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEMESTERS.map(s => <SelectItem key={s} value={s.toString()}>Sem {s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input type="password" placeholder="••••••••" className="pl-10 h-11 rounded-xl" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              Create Account
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-primary/5">
            <p className="text-sm text-muted-foreground">
              Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
