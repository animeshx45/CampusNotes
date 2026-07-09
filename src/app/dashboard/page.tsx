
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, Upload, Bell, BookOpen, MessageSquare, 
  ArrowRight, Users, Clock, TrendingUp, Sparkles 
} from 'lucide-react';
import Link from 'next/link';
import { StudyMaterial, ForumPost } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [uploads, setUploads] = useState<StudyMaterial[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [contributors, setContributors] = useState<any[]>([]);
  
  const [isUploadsLoading, setIsUploadsLoading] = useState(true);
  const [isForumLoading, setIsForumLoading] = useState(true);
  const [isContributorsLoading, setIsContributorsLoading] = useState(true);

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
          setContributors(json.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsContributorsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-primary/10 pb-10">
        <div className="space-y-2">
          <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 font-black tracking-widest text-[10px]">
            CAMPUS LIVE FEED
          </Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            Activity <span className="text-foreground italic">Hub.</span>
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Real-time academic updates from across NIT Srinagar.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-primary/20 h-12 px-6" asChild>
            <Link href="/forum"><MessageSquare className="mr-2 h-4 w-4" /> Join Discussion</Link>
          </Button>
          <Button className="rounded-xl h-12 px-6 shadow-lg shadow-primary/20" asChild>
            <Link href="/upload"><Upload className="mr-2 h-4 w-4" /> Share Notes</Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Sparkles className="h-20 w-20" />
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

        {/* Sidebar */}
        <div className="space-y-8">
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

          <Card className="rounded-[2.5rem] border-none bg-primary text-primary-foreground p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users className="h-32 w-32" />
            </div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-2xl font-bold">Top Contributors</h3>
              <p className="text-sm opacity-80">Students making a difference.</p>
            </div>
            <div className="space-y-3 relative z-10">
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
                      <div className="text-xs font-black opacity-60">#{idx + 1}</div>
                      <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {initials || '?'}
                      </div>
                      <div className="flex flex-col flex-grow min-w-0">
                        <div className="font-bold text-sm truncate">{contr.fullName || contr.username}</div>
                        <div className="text-[9px] opacity-75 uppercase tracking-wider truncate">
                          {contr.branch ? contr.branch : (contr.role || 'Contributor')}
                        </div>
                      </div>
                      <div className="text-xs font-black text-accent shrink-0">{contr.xp} XP</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-sm opacity-60">No contributors yet.</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
