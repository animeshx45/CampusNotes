
"use client";

import { useState, use, useMemo } from 'react';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Send, MessageSquare, Clock, Hash, 
  User, Loader2, Sparkles, MoreVertical, ThumbsUp, Reply
} from 'lucide-react';
import { collection, query, orderBy, addDoc, serverTimestamp, doc } from 'firebase/firestore';
import { ForumPost, ForumReply } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ForumThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const postRef = useMemoFirebase(() => {
    if (!db || !id) return null;
    return doc(db, 'forumPosts', id);
  }, [db, id]);

  const { data: post, isLoading: isPostLoading } = useDoc<ForumPost>(postRef);

  const repliesQuery = useMemoFirebase(() => {
    if (!db || !id) return null;
    return query(collection(db, 'forumPosts', id, 'replies'), orderBy('createdAt', 'asc'));
  }, [db, id]);

  const { data: replies, isLoading: isRepliesLoading } = useCollection<ForumReply>(repliesQuery);

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !replyContent.trim() || !id) return;
    setIsReplying(true);
    try {
      await addDoc(collection(db, 'forumPosts', id, 'replies'), {
        postId: id,
        content: replyContent,
        authorId: user.uid,
        authorName: user.displayName || 'Anonymous NITian',
        createdAt: serverTimestamp(),
      });
      setReplyContent('');
      toast({ title: "Reply Sent", description: "Your comment has been added to the thread." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to post reply.", variant: "destructive" });
    } finally {
      setIsReplying(false);
    }
  };

  if (isPostLoading) {
    return (
      <div className="container mx-auto py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Loading Thread...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-40 text-center space-y-6">
        <h1 className="text-3xl font-bold">Post Not Found</h1>
        <Button asChild rounded-xl><Link href="/forum">Back to Forum</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-500">
      <Link href="/forum" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-8 group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Feed
      </Link>

      <div className="space-y-12">
        {/* Original Post */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge className="bg-primary/10 text-primary border-none rounded-lg px-3 py-1 font-bold text-[10px]">
              <Hash className="h-3 w-3 mr-1" /> {post.branch}
            </Badge>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
               <Clock className="h-3 w-3" /> {new Date(post.createdAt?.seconds * 1000).toLocaleDateString() || 'Recently'}
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary leading-tight">{post.title}</h1>
          
          <div className="flex items-center gap-4 py-4 border-y border-primary/5">
             <div className="h-12 w-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl uppercase shadow-lg">
                {post.authorName.charAt(0)}
             </div>
             <div>
                <p className="font-bold text-lg">{post.authorName}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Post Author</p>
             </div>
          </div>

          <div className="text-lg leading-relaxed text-foreground/80 bg-secondary/10 p-8 rounded-[2rem] border border-primary/5">
            {post.content}
          </div>
        </section>

        {/* Comment Section Header */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-primary/10 pb-4">
             <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> 
                {replies?.length || 0} Comments
             </h3>
             <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <Sparkles className="h-4 w-4 text-accent" /> Sort by: Newest
             </div>
          </div>

          {/* New Comment Input */}
          <Card className="rounded-[1.5rem] border-primary/5 shadow-sm overflow-hidden bg-secondary/20">
             <CardContent className="p-4">
                <form onSubmit={handlePostReply} className="flex gap-4 items-start">
                   <div className="h-10 w-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold uppercase shrink-0">
                      {user?.displayName?.charAt(0) || 'U'}
                   </div>
                   <div className="flex-grow space-y-3">
                      <Input 
                        placeholder="Add a comment..." 
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="bg-transparent border-none focus-visible:ring-0 text-sm font-medium p-0 h-10 placeholder:text-muted-foreground"
                      />
                      <div className="flex justify-end gap-2">
                        {replyContent && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setReplyContent('')}
                            className="text-xs font-bold rounded-full"
                          >
                            Cancel
                          </Button>
                        )}
                        <Button 
                          type="submit" 
                          size="sm" 
                          disabled={!replyContent.trim() || isReplying}
                          className="rounded-full px-6 text-xs font-bold gap-2"
                        >
                          {isReplying ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                          Comment
                        </Button>
                      </div>
                   </div>
                </form>
             </CardContent>
          </Card>

          {/* Replies List */}
          <div className="space-y-6">
            {isRepliesLoading ? (
              <div className="py-20 text-center animate-pulse">
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Fetching comments...</p>
              </div>
            ) : replies?.length ? (
              replies.map((reply) => (
                <div key={reply.id} className="flex gap-4 group animate-in fade-in slide-in-from-top-2 duration-300">
                   <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center font-bold text-sm uppercase shrink-0 shadow-inner">
                      {reply.authorName.charAt(0)}
                   </div>
                   <div className="flex-grow space-y-2">
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-sm">{reply.authorName}</span>
                         <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                            {new Date(reply.createdAt?.seconds * 1000).toLocaleDateString() || 'Just now'}
                         </span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80">{reply.content}</p>
                      <div className="flex items-center gap-4 pt-1">
                         <button className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                            <ThumbsUp className="h-3 w-3" /> Like
                         </button>
                         <button 
                          className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                          onClick={() => {
                            setReplyContent(`@${reply.authorName} `);
                            window.scrollTo({ top: document.querySelector('form')?.getBoundingClientRect().top! + window.scrollY - 200, behavior: 'smooth' });
                          }}
                         >
                            <Reply className="h-3 w-3" /> Reply
                         </button>
                      </div>
                   </div>
                   <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                   </Button>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4 bg-secondary/5 rounded-[2rem] border border-dashed border-primary/5">
                 <MessageSquare className="h-10 w-10 text-primary/20 mx-auto" />
                 <p className="text-muted-foreground font-medium">No comments yet. Start the conversation!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
