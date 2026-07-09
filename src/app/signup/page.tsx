"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, Mail, KeyRound, User as UserIcon, Sparkles, GraduationCap, Zap, ArrowRight } from 'lucide-react';
import { BRANCHES, SEMESTERS } from '@/lib/mock-data';
import { Branch, Semester } from '@/lib/types';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [branch, setBranch] = useState<Branch | ''>('');
  const [semester, setSemester] = useState<Semester>(1);
  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast({ title: "Error", description: "Name, email, and password are required.", variant: "destructive" });
      return;
    }

    if (role !== 'admin' && !branch) {
      toast({ title: "Branch required", description: "Please select your academic branch.", variant: "destructive" });
      return;
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }
      
      if (data.devMode && data.otp) {
        toast({ 
          title: "SMTP Not Configured (Development Mode)", 
          description: `To test signup, enter this code: ${data.otp}. (To send real emails, add EMAIL_USER and EMAIL_PASS to your env variables).`,
          variant: "default",
          duration: 15000
        });
      } else {
        toast({ title: "Verification Code Sent!", description: `We sent a code to ${email}. Check your inbox.` });
      }
      setStep('otp');
    } catch (err: any) {
      toast({ title: "OTP Sending Failed", description: err.message || "Failed to send code.", variant: "destructive" });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      toast({ title: "Verification Required", description: "Please enter the OTP sent to your email.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        role,
        branch: role === 'admin' ? undefined : branch,
        semester: role === 'admin' ? undefined : semester,
        otp: otpCode.trim(),
      });

      toast({ 
        title: "Account Created!", 
        description: role === 'admin' && email.toLowerCase() !== 'rajur@nitsri.ac.in'
          ? "Account registered as student (unauthorized admin request)."
          : "You have signed up successfully." 
      });
      router.push('/');
    } catch (err: any) {
      toast({ 
        title: "Sign Up Failed", 
        description: err.message || "Failed to create account. Try again.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration radial glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <Card className="w-full max-w-lg border-white/5 bg-zinc-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden my-8">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <UserPlus className="h-16 w-16 text-primary" />
        </div>

        <CardHeader className="space-y-3 p-8 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-1">
              <Sparkles className="h-3 w-3 animate-pulse" /> START STUDYING
            </span>
          </div>
          <CardTitle className="text-4xl font-headline font-bold text-primary tracking-tighter">
            {step === 'otp' ? 'Verify Email.' : 'Join Now.'}
          </CardTitle>
          <CardDescription className="text-zinc-400 font-medium">
            {step === 'otp' 
              ? 'Enter the 6-digit OTP code sent to your email.'
              : 'Create an account to browse notes, share resources, and discuss.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          {step === 'form' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-400">Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input 
                    id="name"
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-950 border-white/15 text-white rounded-xl h-12 pl-11 focus-visible:ring-primary focus-visible:ring-1"
                    required
                  />
                </div>
              </div>

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
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-950 border-white/15 text-white rounded-xl h-12 pl-11 focus-visible:ring-primary focus-visible:ring-1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Register As</Label>
                <Select 
                  value={role} 
                  onValueChange={(val: any) => setRole(val)}
                >
                  <SelectTrigger className="bg-zinc-950 border-white/15 text-white rounded-xl h-12">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                    <SelectItem value="student" className="hover:bg-white/10 text-zinc-200">Student</SelectItem>
                    <SelectItem value="teacher" className="hover:bg-white/10 text-zinc-200">Teacher</SelectItem>
                    <SelectItem value="admin" className="hover:bg-white/10 text-zinc-200">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {role !== 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Academic Branch</Label>
                    <Select 
                      value={branch} 
                      onValueChange={(val: any) => setBranch(val)}
                    >
                      <SelectTrigger className="bg-zinc-950 border-white/15 text-white rounded-xl h-12">
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                        {BRANCHES.map(br => (
                          <SelectItem key={br} value={br} className="hover:bg-white/10 text-zinc-200">
                            {br}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Semester</Label>
                    <Select 
                      value={String(semester)} 
                      onValueChange={(val) => setSemester(Number(val) as Semester)}
                    >
                      <SelectTrigger className="bg-zinc-950 border-white/15 text-white rounded-xl h-12">
                        <SelectValue placeholder="Sem" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10 text-white rounded-xl">
                        {SEMESTERS.map(sem => (
                          <SelectItem key={sem} value={String(sem)} className="hover:bg-white/10 text-zinc-200">
                            Sem {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isSendingOtp}
                className="w-full h-12 rounded-xl font-bold bg-white text-black hover:bg-zinc-200 mt-6 shadow-xl flex items-center justify-center gap-2"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending Verification Code...
                  </>
                ) : (
                  <>
                    Get Verification Code <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
              <div className="text-center space-y-2">
                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Verification Required</p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  A 6-digit OTP code was sent to <span className="text-primary font-bold">{email}</span>. Please enter it below:
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-xs font-bold uppercase tracking-wider text-zinc-400">One-Time Password (OTP)</Label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <Input 
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otpCode}
                    maxLength={6}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="bg-zinc-950 border-white/15 text-white rounded-xl h-12 pl-11 text-center tracking-[8px] font-bold text-lg focus-visible:ring-primary focus-visible:ring-1"
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
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    Verify and Sign Up <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-2">
                <button 
                  type="button" 
                  onClick={() => setStep('form')} 
                  className="hover:text-white transition-colors underline"
                >
                  Change details
                </button>
                <button 
                  type="button" 
                  onClick={() => handleSendOtp()} 
                  disabled={isSendingOtp}
                  className="hover:text-white transition-colors underline disabled:opacity-50"
                >
                  {isSendingOtp ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="p-8 pt-0 border-t border-white/5 justify-center mt-2 flex flex-col gap-2">
          <p className="text-sm text-zinc-400 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign In
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
