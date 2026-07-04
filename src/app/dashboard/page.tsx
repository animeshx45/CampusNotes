
"use client";

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, Upload, Settings, Bell, BookOpen, MessageSquare, 
  ArrowRight, Users, CheckCircle, Clock, TrendingUp, Sparkles 
} from 'lucide-react';
import Link from 'next/link';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { StudyMaterial, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const userProfileQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users'), where('id', '==', user.uid), limit(1));
  }, [db, user]);

  const { data: profiles } = useCollection<User>(userProfileQuery);
  const profile = profiles?.[0];

  const uploadsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'studyMaterials'), 
      where('uploaderId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
  }, [db, user]);

  const { data: uploads, isLoading: isUploadsLoading } = useCollection<StudyMaterial>(uploadsQuery);

  if (isUserLoading) return <DashboardSkeleton />;

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-2">
          <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1">
            {profile?.role?.toUpperCase() || 'STUDENT'} PORTAL
          </Badge>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">
            Welcome back, <span className="text-foreground">{user?.displayName?.split(' ')[0] || 'Scholar'}</span>!
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> {profile?.branch} • Sem {profile?.semester}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl border-primary/20 h-12 px-6" asChild>
            <Link href="/forum"><MessageSquare className="mr-2 h-4 w-4" /> Discuss</Link>
          </Button>
          <Button className="rounded-xl h-12 px-6 shadow-lg shadow-primary/20" asChild>
            <Link href="/upload"><Upload className="mr-2 h-4 w-4" /> Share Material</Link>
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
                <CardTitle className="text-lg font-bold">Academic Status</CardTitle>
                <CardDescription>Your current progress this semester</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center bg-background/50 p-4 rounded-2xl">
                   <div className="text-sm font-bold">Materials Accessed</div>
                   <div className="text-2xl font-black text-primary">24</div>
                </div>
                <div className="flex justify-between items-center bg-background/50 p-4 rounded-2xl">
                   <div className="text-sm font-bold">Forum Contributions</div>
                   <div className="text-2xl font-black text-accent">12</div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-primary/5 bg-primary text-primary-foreground overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles className="h-20 w-20" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-bold">AI Helper</CardTitle>
                <CardDescription className="text-primary-foreground/70">Analyze your uploaded notes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full rounded-xl font-bold h-11" asChild>
                  <Link href="/browse">Analyze Latest Notes</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-[2.5rem] border-primary/5 shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="uploads" className="w-full">
                <TabsList className="w-full bg-transparent border-b border-primary/5 rounded-none p-0 h-14">
                  <TabsTrigger value="uploads" className="flex-1 data-[state=active]:bg-primary/5 data-[state=active]:text-primary font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all">My Uploads</TabsTrigger>
                  <TabsTrigger value="forum" className="flex-1 data-[state=active]:bg-primary/5 data-[state=active]:text-primary font-bold rounded-none border-b-2 border-transparent data-[state=active]:border-primary transition-all">Forum Activity</TabsTrigger>
                </TabsList>
                <TabsContent value="uploads" className="p-6 m-0">
                  {isUploadsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-2xl" />)}
                    </div>
                  ) : uploads?.length ? (
                    <div className="space-y-4">
                      {uploads.map(material => (
                        <div key={material.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl group hover:bg-secondary/40 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-bold text-sm line-clamp-1">{material.title}</p>
                              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">{material.type}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" asChild className="rounded-lg group-hover:bg-primary group-hover:text-white">
                            <Link href={`/material/${material.id}`}><ArrowRight className="h-4 w-4" /></Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 space-y-4">
                      <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto opacity-20">
                        <Upload className="h-8 w-8" />
                      </div>
                      <p className="text-muted-foreground font-medium">No uploads yet. Share your first note!</p>
                      <Button asChild variant="outline" className="rounded-xl"><Link href="/upload">Upload Now</Link></Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="forum" className="p-6 m-0">
                   <div className="text-center py-12 text-muted-foreground font-medium">No recent forum interactions.</div>
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
                <div key={i} className="flex items-start gap-4 p-4 bg-secondary/20 rounded-2xl hover:bg-secondary/40 transition-colors">
                  <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notif.type === 'resource' ? 'bg-primary' : 'bg-accent'}`} />
                  <div>
                    <p className="text-sm font-bold leading-tight">{notif.title}</p>
                    <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-widest">{notif.date}</p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs font-bold text-primary rounded-xl" asChild>
                <Link href="/notifications">View All Notifications</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-none bg-primary text-primary-foreground p-8 space-y-6">
            <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center">
               <Users className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Community Leaderboard</h3>
              <p className="text-sm opacity-80">Top contributors for {profile?.branch || 'NIT Srinagar'}</p>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                  <div className="text-xs font-black opacity-40">#{i}</div>
                  <div className="h-8 w-8 rounded-full bg-white/20" />
                  <div className="flex-grow font-bold text-sm">NITian_{i}01</div>
                  <div className="text-xs font-black text-accent">{1000 - (i*100)} XP</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl space-y-12">
      <div className="space-y-4">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-12 w-96 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-40 w-full rounded-[2rem]" />
            <Skeleton className="h-40 w-full rounded-[2rem]" />
          </div>
          <Skeleton className="h-96 w-full rounded-[2.5rem]" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-80 w-full rounded-[2.5rem]" />
          <Skeleton className="h-80 w-full rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}
