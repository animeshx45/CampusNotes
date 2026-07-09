'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BRANCHES, SEMESTERS } from '@/lib/mock-data';
import { User, Award, BookOpen, MessageSquare, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isUserLoading, setUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [branch, setBranch] = useState<string>('');
  const [semester, setSemester] = useState<string>('');

  const [isUpdating, setIsUpdating] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [stats, setStats] = useState({ xp: 0, rank: '-', materials: 0, posts: 0, replies: 0 });

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // Set initial form states
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setUsername(user.username || '');
      setBranch(user.branch || '');
      setSemester(user.semester?.toString() || '');
    }
  }, [user]);

  // Fetch contributor stats to show user XP and ranking
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        setIsStatsLoading(true);
        const res = await fetch('/api/contributors');
        if (res.ok) {
          const json = await res.json();
          const list = json.data || [];
          const idx = list.findIndex((c: any) => c.id === user.id);
          if (idx !== -1) {
            const entry = list[idx];
            setStats({
              xp: entry.xp || 0,
              rank: `#${idx + 1}`,
              materials: entry.contributions?.materials || 0,
              posts: entry.contributions?.posts || 0,
              replies: entry.contributions?.replies || 0
            });
          }
        }
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setIsStatsLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (isUserLoading || !user) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !username.trim()) {
      toast({ title: 'Error', description: 'Name and Username cannot be empty.', variant: 'destructive' });
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          username,
          branch: branch || null,
          semester: semester ? parseInt(semester) : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setUser(data.user);
      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
      });
    } catch (err: any) {
      toast({
        title: 'Update failed',
        description: err.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const initials = (user.fullName || '')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in duration-500">
      <header className="mb-12 border-b border-primary/10 pb-10">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
          My <span className="text-foreground italic">Profile.</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal details and view your peer study contributions.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats card & Rank */}
        <div className="space-y-8">
          <Card className="rounded-[2.5rem] border-primary/5 bg-secondary/15 overflow-hidden shadow-xl relative p-8">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Sparkles className="h-32 w-32 text-primary" />
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-black text-primary border-4 border-primary/30 shadow-lg relative group">
                {initials || '?'}
                <div className="absolute -bottom-1 -right-1 bg-accent text-accent-foreground text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow border border-primary/20">
                  {user.role}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-foreground">{user.fullName}</h3>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">@{user.username}</p>
                <p className="text-sm font-medium text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="border-t border-primary/5 my-8 pt-8 grid grid-cols-2 gap-4">
              <div className="bg-background/40 p-4 rounded-2xl border border-primary/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Rank</p>
                <p className="text-2xl font-black text-primary mt-1">{isStatsLoading ? '...' : stats.rank}</p>
              </div>
              <div className="bg-background/40 p-4 rounded-2xl border border-primary/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total XP</p>
                <p className="text-2xl font-black text-accent mt-1">{isStatsLoading ? '...' : stats.xp} XP</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-primary/5 pb-2">Contributions Summary</h4>
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="flex items-center gap-2 text-muted-foreground"><BookOpen className="h-4 w-4" /> Uploaded Notes</span>
                <span className="font-bold text-foreground">{isStatsLoading ? '...' : stats.materials}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="flex items-center gap-2 text-muted-foreground"><MessageSquare className="h-4 w-4" /> Discussion Posts</span>
                <span className="font-bold text-foreground">{isStatsLoading ? '...' : stats.posts}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="flex items-center gap-2 text-muted-foreground"><MessageSquare className="h-4 w-4" /> Replies Posted</span>
                <span className="font-bold text-foreground">{isStatsLoading ? '...' : stats.replies}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Edit Details form */}
        <div className="lg:col-span-2">
          <Card className="rounded-[2.5rem] border-primary/5 shadow-xl bg-card">
            <CardHeader className="border-b border-primary/5 pb-6">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Edit Profile Details
              </CardTitle>
              <CardDescription>Update your personal information used throughout the portal.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="rounded-xl h-12 bg-secondary/10 border-none shadow-inner font-semibold text-foreground focus-visible:ring-1 focus-visible:ring-primary/30"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="rounded-xl h-12 bg-secondary/10 border-none shadow-inner font-semibold text-foreground focus-visible:ring-1 focus-visible:ring-primary/30"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="branch" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Branch / Department</Label>
                    <Select onValueChange={setBranch} value={branch}>
                      <SelectTrigger id="branch" className="rounded-xl h-12 bg-secondary/10 border-none shadow-inner font-semibold text-foreground">
                        <SelectValue placeholder="Which branch?" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="semester" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Semester</Label>
                    <Select onValueChange={setSemester} value={semester}>
                      <SelectTrigger id="semester" className="rounded-xl h-12 bg-secondary/10 border-none shadow-inner font-semibold text-foreground">
                        <SelectValue placeholder="Which semester?" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEMESTERS.map(s => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 pt-2 bg-secondary/10 p-4 rounded-2xl border border-primary/5">
                  <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground"><ShieldAlert className="h-4 w-4 text-amber-500" /> Account Security Info</span>
                  <p className="text-xs text-muted-foreground">Your account email (<strong className="text-foreground">{user.email}</strong>) and role credentials are managed securely. Contact the support team or administrator if you require an email change or access tier modification.</p>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-primary/5">
                  <Button type="button" variant="ghost" asChild className="rounded-xl h-12 px-6">
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                  <Button type="submit" disabled={isUpdating} className="rounded-xl h-12 px-6 shadow-lg shadow-primary/20">
                    {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
