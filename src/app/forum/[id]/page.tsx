"use client";

import { useState, use, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, Send, MessageSquare, Clock, Hash, 
  Loader2, Sparkles, MoreVertical, ThumbsUp, Reply, Trash2, Edit
} from 'lucide-react';
import { ForumPost, ForumReply } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export default function ForumThreadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();

  const isAdmin = user?.role === 'admin';
  
  const [replyContent, setReplyContent] = useState('');
  const [replierName, setReplierName] = useState('');

  const [post, setPost] = useState<ForumPost | null>(null);
  const [isPostLoading, setIsPostLoading] = useState(true);

  // Editing States
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostContent, setEditPostContent] = useState('');

  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingReplyContent, setEditingReplyContent] = useState('');

  // Permissions
  const isPostOwner = !!(user && post && (user.id === post.authorId || user.uid === post.authorId || user.fullName === post.authorName));
  const canDeletePost = isAdmin || isPostOwner;
  const canEditPost = isPostOwner;

  const canDeleteReply = (reply: ForumReply) => isAdmin || !!(user && (user.id === reply.authorId || user.uid === reply.authorId || user.fullName === reply.authorName));
  const canEditReply = (reply: ForumReply) => !!(user && (user.id === reply.authorId || user.uid === reply.authorId || user.fullName === reply.authorName));

  const fetchPostDetails = async () => {
    try {
      setIsPostLoading(true);
      const res = await fetch(`/api/forum/${id}`);
      if (res.ok) {
        const json = await res.json();
        setPost(json.data);
      }
    } catch (e) {
      console.error("Failed to load forum thread", e);
    } finally {
      setIsPostLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const replies = post?.replies || [];
  const isRepliesLoading = false;

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !replierName.trim() || !id) {
      toast({ title: "Name & Content Required", description: "Please enter your name and message to reply.", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch(`/api/forum/${id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          authorId: user?.id || 'public-user',
          authorName: replierName,
        }),
      });

      if (!res.ok) throw new Error("Failed to post reply");

      setReplyContent('');
      toast({ title: "Reply Sent", description: "Your comment has been added to the thread." });
      fetchPostDetails(); // Refresh details to get new reply
    } catch (error) {
      toast({ title: "Error", description: "Could not add comment.", variant: "destructive" });
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this discussion thread? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/forum/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast({ title: "Thread Deleted", description: "Discussion thread has been removed successfully." });
        router.push('/forum');
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (err) {
      toast({ title: "Error", description: "Could not delete thread.", variant: "destructive" });
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      const res = await fetch(`/api/forum/${id}/replies?replyId=${replyId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast({ title: "Comment Deleted", description: "Comment has been removed successfully." });
        fetchPostDetails(); // Reload comments
      } else {
        throw new Error("Failed to delete reply");
      }
    } catch (err) {
      toast({ title: "Error", description: "Could not delete comment.", variant: "destructive" });
    }
  };

  const handleStartEditPost = () => {
    if (!post) return;
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
    setIsEditingPost(true);
  };

  const handleSavePost = async () => {
    if (!editPostTitle.trim() || !editPostContent.trim()) {
      toast({ title: "Fields Required", description: "Title and content cannot be empty.", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`/api/forum/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editPostTitle, content: editPostContent }),
      });
      if (res.ok) {
        toast({ title: "Thread Updated", description: "Discussion thread details saved." });
        setIsEditingPost(false);
        fetchPostDetails();
      } else {
        throw new Error("Failed to edit thread");
      }
    } catch (e) {
      toast({ title: "Error", description: "Could not update thread.", variant: "destructive" });
    }
  };

  const handleStartEditReply = (replyId: string, currentContent: string) => {
    setEditingReplyId(replyId);
    setEditingReplyContent(currentContent);
  };

  const handleSaveReply = async (replyId: string) => {
    if (!editingReplyContent.trim()) {
      toast({ title: "Content Required", description: "Comment cannot be empty.", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`/api/forum/${id}/replies`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyId, content: editingReplyContent }),
      });
      if (res.ok) {
        toast({ title: "Comment Updated", description: "Your comment was modified." });
        setEditingReplyId(null);
        fetchPostDetails();
      } else {
        throw new Error("Failed to edit comment");
      }
    } catch (e) {
      toast({ title: "Error", description: "Could not update comment.", variant: "destructive" });
    }
  };

  const handleToggleLikeReply = async (replyId: string) => {
    if (!user) {
      toast({ title: "Auth Required", description: "You must be logged in to like comments.", variant: "destructive" });
      return;
    }

    try {
      const res = await fetch(`/api/forum/${id}/replies`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyId,
          userId: user.id || user.uid,
        }),
      });

      if (!res.ok) throw new Error("Failed to like reply");

      const json = await res.json();
      if (json.success && json.likes) {
        setPost(prev => {
          if (!prev) return null;
          const updatedReplies = (prev.replies || []).map(r => {
            const rId = r.id || (r as any)._id;
            if (rId === replyId) {
              return { ...r, likes: json.likes };
            }
            return r;
          });
          return { ...prev, replies: updatedReplies };
        });
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not process like.", variant: "destructive" });
    }
  };

  useEffect(() => {
    if (user?.fullName) {
      setReplierName(user.fullName);
    }
  }, [user]);

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
        <Button asChild className="rounded-xl px-8"><Link href="/forum">Back to Forum</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <Link href="/forum" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Feed
        </Link>
        <div className="flex gap-2">
          {canEditPost && (
            <Button variant="outline" size="sm" className="rounded-xl font-bold h-9 border-primary/20" onClick={handleStartEditPost}>
              Edit Thread
            </Button>
          )}
          {canDeletePost && (
            <Button variant="destructive" size="sm" className="rounded-xl font-bold h-9" onClick={handleDeletePost}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete Thread
            </Button>
          )}
        </div>
      </div>

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
          
          {isEditingPost ? (
            <div className="space-y-4 bg-secondary/10 p-6 rounded-[2rem] border border-primary/10">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Edit Title</label>
                <Input 
                  value={editPostTitle} 
                  onChange={(e) => setEditPostTitle(e.target.value)} 
                  className="rounded-xl font-bold bg-background border-none shadow-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Edit Content</label>
                <textarea 
                  value={editPostContent} 
                  onChange={(e) => setEditPostContent(e.target.value)} 
                  rows={6}
                  className="w-full rounded-xl p-3 font-medium bg-background border-none shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" className="rounded-full px-6 font-bold" onClick={() => setIsEditingPost(false)}>Cancel</Button>
                <Button size="sm" className="rounded-full px-6 font-bold" onClick={handleSavePost}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary leading-tight">{post.title}</h1>
              
              <div className="flex items-center gap-4 py-4 border-y border-primary/5">
                 <div className="h-12 w-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl uppercase shadow-lg">
                    {post.authorName?.charAt(0) || 'A'}
                 </div>
                 <div>
                    <p className="font-bold text-lg">{post.authorName}</p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Post Contributor</p>
                 </div>
              </div>

              <div className="text-lg leading-relaxed text-foreground/80 bg-secondary/10 p-8 rounded-[2rem] border border-primary/5">
                {post.content}
              </div>
            </>
          )}
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
             <CardContent className="p-4 space-y-4">
                <div className="flex gap-4 items-center mb-2">
                   <Input 
                      placeholder="Your Name" 
                      value={replierName}
                      onChange={(e) => setReplierName(e.target.value)}
                      className="bg-background border-none rounded-xl h-10 text-sm font-bold shadow-inner max-w-[200px]"
                   />
                   <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Replying to {post.authorName}</span>
                </div>
                <form onSubmit={handlePostReply} className="flex gap-4 items-start">
                   <div className="h-10 w-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold uppercase shrink-0 shadow-lg">
                      {replierName?.charAt(0) || '?'}
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
                          disabled={!replyContent.trim() || !replierName.trim()}
                          className="rounded-full px-6 text-xs font-bold gap-2 shadow-lg"
                        >
                          <Send className="h-3 w-3" />
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
              replies.map((reply: ForumReply) => (
                <div key={reply.id} className="flex gap-4 group animate-in fade-in slide-in-from-top-2 duration-300">
                   <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center font-bold text-sm uppercase shrink-0 shadow-inner border border-primary/5">
                      {reply.authorName?.charAt(0) || 'A'}
                   </div>
                   <div className="flex-grow space-y-2">
                      <div className="flex items-center gap-2">
                         <span className="font-bold text-sm">{reply.authorName}</span>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                             {reply.createdAt?.seconds 
                               ? new Date(reply.createdAt.seconds * 1000).toLocaleDateString()
                               : reply.createdAt 
                                 ? new Date(reply.createdAt).toLocaleDateString()
                                 : 'Just now'}
                          </span>
                      </div>
                      {editingReplyId === (reply.id || (reply as any)._id) ? (
                        <div className="space-y-2 bg-background p-3 rounded-xl border border-primary/5 shadow-sm">
                          <textarea
                            value={editingReplyContent}
                            onChange={(e) => setEditingReplyContent(e.target.value)}
                            rows={2}
                            className="w-full text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0 text-foreground"
                          />
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" className="rounded-full text-[10px] h-8" onClick={() => setEditingReplyId(null)}>Cancel</Button>
                            <Button size="sm" className="rounded-full text-[10px] h-8" onClick={() => handleSaveReply(reply.id || (reply as any)._id)}>Save</Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed text-foreground/80">{reply.content}</p>
                      )}
                      <div className="flex items-center gap-4 pt-1">
                         <button 
                          className={`flex items-center gap-1.5 text-[10px] font-black transition-colors uppercase tracking-widest ${
                            user && reply.likes?.includes(user.id || user.uid || '') 
                              ? 'text-primary hover:text-primary/80' 
                              : 'text-muted-foreground hover:text-primary'
                          }`}
                          onClick={() => handleToggleLikeReply(reply.id || (reply as any)._id)}
                         >
                            <ThumbsUp className={`h-3 w-3 ${user && reply.likes?.includes(user.id || user.uid || '') ? 'fill-current' : ''}`} /> 
                            {reply.likes?.length ? `${reply.likes.length} Likes` : 'Like'}
                         </button>
                         <button 
                          className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                          onClick={() => {
                            setReplyContent(`@${reply.authorName} `);
                          }}
                         >
                            <Reply className="h-3 w-3" /> Reply
                         </button>
                      </div>
                   </div>
                     <div className="flex gap-1 shrink-0">
                      {(canEditReply(reply) || canDeleteReply(reply)) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-32 bg-popover border border-white/10 rounded-xl shadow-xl">
                            {canEditReply(reply) && (
                              <DropdownMenuItem 
                                onClick={() => handleStartEditReply(reply.id || (reply as any)._id, reply.content)}
                                className="flex items-center gap-2 cursor-pointer font-semibold text-xs"
                              >
                                <Edit className="h-3.5 w-3.5 text-primary" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                            )}
                            {canDeleteReply(reply) && (
                              <DropdownMenuItem 
                                onClick={() => handleDeleteReply(reply.id || (reply as any)._id)}
                                className="flex items-center gap-2 cursor-pointer font-semibold text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
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
