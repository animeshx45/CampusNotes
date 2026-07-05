
"use client";

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, Search, Send, Plus, Filter, User, 
  Clock, TrendingUp, Hash, ArrowRight, Loader2, BookOpen
} from 'lucide-react';
import { collection, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { ForumPost } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BRANCHES } from '@/lib/mock-data';
import Link from 'next/link';

export default function ForumPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [isPosting, setIsPosting] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', branch: 'Information Technology' as any });
  const [searchQuery, setSearchQuery] = useState('');

  const forumQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'forumPosts'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: posts, isLoading } = useCollection<ForumPost>(forumQuery);

  const handleCreatePost = async () => {
    if (!user || !newPost.title || !newPost.content) return;
    setIsPosting(true);
    try {
      await addDoc(collection(db, 'forumPosts'), {
        title: newPost.title,
        content: newPost.content,
        branch: newPost.branch,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous NITian',
        createdAt: serverTimestamp(),
      });
      toast({ title: "Post Shared", description: "Your discussion thread has been created." });
      setNewPost({ title: '', content: '', branch: 'Information Technology' });
    } catch (e) {
      toast({ title: "Error", description: "Failed to create post.", variant: "destructive" });
    } finally {
      setIsPosting(false);
    }
  };

  const filteredPosts = posts?.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16 border-b border-primary/10 pb-12">
        <div className="space-y-4">
          <Badge className="bg-accent text-accent-foreground rounded-full px-4 py-1 font-black tracking-widest uppercase text-[10px]">Academic Discourse</Badge>
          <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary tracking-tighter">Campus <br /><span className="text-foreground italic">Feed.</span></h1>
          <p className="text-muted-foreground text-xl max-w-md">Join the conversation. Ask anything, answer everything.</p>
        </div>
        
        <div className="flex flex-col w-full md:w-auto gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search discussions..." 
              className="pl-12 h-14 w-full md:w-80 rounded-2xl bg-secondary/20 border-primary/5 focus-visible:ring-primary shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-14 rounded-2xl font-bold shadow-xl shadow-primary/20 gap-2">
                <Plus className="h-5 w-5" /> Start Discussion
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
              <DialogHeader className="bg-primary text-primary-foreground p-8">
                <DialogTitle className="text-2xl font-headline font-bold">New Discussion Thread</DialogTitle>
              </DialogHeader>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Title</label>
                  <Input placeholder="What's your question?" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Branch</label>
                  <select 
                    className="w-full h-12 rounded-xl border bg-background px-3 text-sm" 
                    value={newPost.branch}
                    onChange={(e) => setNewPost({...newPost, branch: e.target.value as any})}
                  >
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Content</label>
                  <Textarea placeholder="Explain your doubt in detail..." value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} className="rounded-2xl min-h-[150px] p-4" />
                </div>
                <Button onClick={handleCreatePost} disabled={isPosting} className="w-full h-14 rounded-2xl font-bold text-lg">
                  {isPosting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Send className="h-5 w-5 mr-2" />}
                  Publish Thread
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="font-bold uppercase tracking-widest text-xs">Syncing discussions...</p>
             </div>
          ) : filteredPosts?.length ? (
            filteredPosts.map((post) => (
              <Link key={post.id} href={`/forum/${post.id}`} className="block">
                <Card className="rounded-[2rem] border-primary/5 hover:border-primary/20 transition-all group hover:shadow-2xl overflow-hidden bg-card border">
                  <CardHeader className="p-8 pb-4">
                    <div className="flex justify-between items-start mb-6">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-none rounded-lg px-3 py-1 font-bold text-[10px]">
                         <Hash className="h-3 w-3 mr-1" /> {post.branch}
                      </Badge>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                         <Clock className="h-3 w-3" /> {new Date(post.createdAt?.seconds * 1000).toLocaleDateString() || 'Recently'}
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors leading-tight line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <p className="text-muted-foreground leading-relaxed line-clamp-3 text-sm">{post.content}</p>
                  </CardContent>
                  <CardFooter className="p-8 pt-0 flex items-center justify-between border-t border-primary/5 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center text-primary font-bold shadow-inner uppercase">
                        {post.authorName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Author</p>
                        <p className="text-sm font-bold">{post.authorName}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-xl border-primary/10 hover:bg-primary hover:text-white transition-all group/btn">
                      Join Discussion <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-32 bg-secondary/5 rounded-[3rem] border-2 border-dashed border-primary/10 space-y-6">
               <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="h-10 w-10 text-primary opacity-40" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-2xl font-bold">No discussions found</h3>
                 <p className="text-muted-foreground max-w-xs mx-auto">Be the first to start a conversation for this topic.</p>
               </div>
            </div>
          )}
        </div>

        <aside className="space-y-10">
          <Card className="rounded-[2.5rem] border-none shadow-2xl bg-primary text-primary-foreground overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                <TrendingUp className="h-32 w-32" />
             </div>
             <CardHeader className="relative z-10 border-b border-white/10 pb-6">
                <CardTitle className="font-headline font-bold text-xl flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-accent" /> Trending Topics
                </CardTitle>
             </CardHeader>
             <CardContent className="p-8 relative z-10 space-y-6">
                {[
                  { tag: 'MidSem Prep', count: 42, color: 'bg-accent' },
                  { tag: 'Internship 2024', count: 38, color: 'bg-white' },
                  { tag: 'IT-Syllabus', count: 25, color: 'bg-white' },
                  { tag: 'Gate2025', count: 19, color: 'bg-accent' },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between group/tag cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${t.color}`} />
                      <span className="font-bold text-sm group-hover/tag:underline">#{t.tag}</span>
                    </div>
                    <span className="text-[10px] font-black opacity-60">{t.count} posts</span>
                  </div>
                ))}
             </CardContent>
          </Card>

          <Card className="rounded-[2.5rem] border-primary/5 shadow-xl bg-card overflow-hidden">
             <CardHeader className="bg-primary/5 p-8">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" /> Guidelines
                </CardTitle>
             </CardHeader>
             <CardContent className="p-8 space-y-6">
                <div className="space-y-1 text-sm">
                   <p className="font-bold text-primary italic">1. Be Academic</p>
                   <p className="text-muted-foreground">Keep discussions strictly related to course curricula.</p>
                </div>
                <div className="space-y-1 text-sm">
                   <p className="font-bold text-primary italic">2. Respect Privacy</p>
                   <p className="text-muted-foreground">Don't share private IDs or exam question papers during tests.</p>
                </div>
                <div className="space-y-1 text-sm">
                   <p className="font-bold text-primary italic">3. Helping Hands</p>
                   <p className="text-muted-foreground">Contribute constructive answers to help juniors.</p>
                </div>
             </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
