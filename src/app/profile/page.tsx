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
import { 
  User, Award, BookOpen, MessageSquare, ShieldAlert, Sparkles, Loader2,
  FileText, Upload, Bell, Clock, TrendingUp, ArrowRight, Users
} from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudyMaterial, ForumPost } from '@/lib/types';

export default function ProfileDashboardPage() {
  const { user, isUserLoading, setUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Profile Form States
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [branch, setBranch] = useState<string>('');
  const [semester, setSemester] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Stats / Contributor States
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [stats, setStats] = useState({ xp: 0, rank: '-', materials: 0, posts: 0, replies: 0 });
  const [contributors, setContributors] = useState<any[]>([]);
  const [isContributorsLoading, setIsContributorsLoading] = useState(true);

  // Dashboard Feed States
  const [uploads, setUploads] = useState<StudyMaterial[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isUploadsLoading, setIsUploadsLoading] = useState(true);
  const [isForumLoading, setIsForumLoading] = useState(true);

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

  // Fetch all dashboard feeds and contributor data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsUploadsLoading(true);
        const resMat = await fetch('/api/materials');
        if (resMat.ok) {
          const json = await resMat.json();
          setUploads((json.data || []).slice(0, 10));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsUploadsLoading(false);
      }

      try {
        setIsForumLoading(true);
        const resForum = await fetch('/api/forum');
        if (resForum.ok) {
          const json = await resForum.json();
          setPosts((json.data || []).slice(0, 10));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsForumLoading(false);
      }

      try {
        setIsContributorsLoading(true);
        const resContr = await fetch('/api/contributors');
        if (resContr.ok) {
          const json = await resContr.json();
          const list = json.data || [];
          setContributors(list);

          // Find current user's stats
          if (user) {
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
        }
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setIsContributorsLoading(false);
        setIsStatsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
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
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-primary/10 pb-10">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            My Profile & <span className="text-foreground italic">Activity.</span>
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Personal configurations and live campus feed.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-primary/20 h-12 px-6 animate-pulse hover:animate-none" asChild>
            <Link href="/forum"><MessageSquare className="mr-2 h-4 w-4" /> Join Discussion</Link>
          </Button>
          <Button className="rounded-xl h-12 px-6 shadow-lg shadow-primary/20" asChild>
            <Link href="/upload"><Upload className="mr-2 h-4 w-4" /> Share Notes</Link>
          </Button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width) - Edit Form, Contributors & Live Timeline */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Edit Profile Form */}
            <Card className="rounded-[2.5rem] border-primary/5 shadow-xl bg-card flex flex-col justify-between">
              <CardHeader className="border-b border-primary/5 pb-6">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" /> Edit Profile Details
                </CardTitle>
                <CardDescription>Update your personal information used throughout the portal.</CardDescription>
              </CardHeader>
              <CardContent className="pt-8 flex-grow">
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="flex justify-end gap-3 pt-6 border-t border-primary/5">
                    <Button type="submit" disabled={isUpdating} className="rounded-xl h-12 px-6 shadow-lg shadow-primary/20 w-full">
                      {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Top Contributors Card */}
            <Card className="rounded-[2.5rem] border-none bg-primary text-primary-foreground p-8 space-y-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Users className="h-32 w-32 animate-pulse" />
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-2xl font-bold">Top Contributors</h3>
                <p className="text-sm opacity-80">Students making a difference.</p>
              </div>
              <div className="space-y-3 relative z-10 flex-grow mt-2">
                {isContributorsLoading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl animate-pulse">
                      <div className="h-4 w-4 bg-white/20 rounded" />
                      <div className="h-8 w-8 bg-white/20 rounded-full" />
                      <div className="h-4 bg-white/20 rounded flex-grow" />
                      <div className="h-4 w-12 bg-white/20 rounded" />
                    </div>
                  ))
                ) : contributors.length > 0 ? (
                  contributors.slice(0, 5).map((contr, idx) => {
                    const initials = (contr.fullName || contr.username || '')
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <div key={contr.id || idx} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300">
                        <div className="text-xs font-black opacity-60 text-white">#{idx + 1}</div>
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {initials || '?'}
                        </div>
                        <div className="flex flex-col flex-grow min-w-0">
                          <div className="font-bold text-sm truncate text-white">{contr.fullName || contr.username}</div>
                          <div className="text-[9px] opacity-75 uppercase tracking-wider truncate text-white/95">
                            {contr.branch ? contr.branch : (contr.role || 'Contributor')}
                          </div>
                        </div>
                        <div className="text-xs font-black text-accent shrink-0">{contr.xp} XP</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-sm opacity-60 text-white/70">No contributors yet.</div>
                )}
              </div>
            </Card>
          </div>

          {/* Community Timeline Feed */}
          <Card className="rounded-[2.5rem] border-primary/5 shadow-xl overflow-hidden bg-card">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Community Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="uploads" className="w-full">
                <TabsList className="w-full bg-transparent border-b border-primary/5 rounded-none p-0 h-14">
                  <TabsTrigger value="uploads" className="flex-1 data-[state=active]:bg-primary/5 data-[state=active]:text-primary font-black uppercase text-[10px] tracking-widest rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all">Latest Uploads</TabsTrigger>
                  <TabsTrigger value="forum" className="flex-1 data-[state=active]:bg-primary/5 data-[state=active]:text-primary font-black uppercase text-[10px] tracking-widest rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all">Recent Topics</TabsTrigger>
                </TabsList>
                <TabsContent value="uploads" className="p-6 m-0">
                  {isUploadsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
                    </div>
                  ) : uploads?.length ? (
                    <div className="space-y-4">
                      {uploads.map(material => (
                        <div key={material.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl group hover:bg-secondary/40 transition-colors border border-primary/5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-bold text-sm line-clamp-1">{material.title}</p>
                              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{material.type} • {material.branch}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild className="rounded-lg">
                            <Link href={`/material/${material.id}`}><ArrowRight className="h-4 w-4" /></Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-4">
                      <p className="text-muted-foreground font-medium">No uploads yet.</p>
                      <Button asChild variant="outline" className="rounded-xl"><Link href="/upload">Be the First</Link></Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="forum" className="p-6 m-0">
                  {isForumLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
                    </div>
                  ) : posts?.length ? (
                    <div className="space-y-4">
                      {posts.map(post => (
                        <div key={post.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl group hover:bg-secondary/40 transition-colors border border-primary/5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                              <MessageSquare className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-bold text-sm line-clamp-1">{post.title}</p>
                              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{post.authorName} • {post.branch}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild className="rounded-lg">
                            <Link href={`/forum/${post.id}`}><ArrowRight className="h-4 w-4" /></Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground font-medium">No recent forum interactions.</div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width) - User Card, Stats & Announcements */}
        <div className="space-y-8">
          
          {/* User Card */}
          <Card className="rounded-[2.5rem] border-primary/5 bg-secondary/15 overflow-hidden shadow-xl relative p-8">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Sparkles className="h-32 w-32 text-primary" />
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-black text-primary border-4 border-primary/30 shadow-lg relative">
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

          {/* Campus Stats / AI Study Buddy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-1">
            <Card className="rounded-[2rem] border-primary/5 bg-secondary/10 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-20 w-20" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Campus Stats</CardTitle>
                <CardDescription>Overall academic contribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center bg-background/50 p-4 rounded-2xl shadow-inner">
                   <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Resources</div>
                   <div className="text-2xl font-black text-primary">{uploads?.length || 0}</div>
                </div>
                <div className="flex justify-between items-center bg-background/50 p-4 rounded-2xl shadow-inner">
                   <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Threads</div>
                   <div className="text-2xl font-black text-accent">{posts?.length || 0}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-primary/5 bg-primary text-primary-foreground overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles className="h-20 w-20 text-white" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white">AI Study Buddy</CardTitle>
                <CardDescription className="text-white/70">Analyze any shared notes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full rounded-xl font-bold h-11 text-primary shadow-xl" asChild>
                  <Link href="/browse">Go to Library</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Announcements */}
          <Card className="rounded-[2.5rem] border-primary/5 shadow-xl bg-card">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Bell className="h-5 w-5 text-accent" /> Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'End Sem PYPs Added', date: '2 hours ago', type: 'resource' },
                { title: 'Scholarship Update', date: 'Yesterday', type: 'info' },
                { title: 'New Faculty Notes', date: '3 days ago', type: 'resource' },
              ].map((notif, i) => (
                <div key={i} className="flex items-start gap-4 p-4 bg-secondary/20 rounded-2xl hover:bg-secondary/40 transition-colors border border-primary/5">
                  <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notif.type === 'resource' ? 'bg-primary' : 'bg-accent'}`} />
                  <div>
                    <p className="text-sm font-bold leading-tight">{notif.title}</p>
                    <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-widest">{notif.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
