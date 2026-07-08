'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUser } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShieldCheck, Search, Trash2, CheckCircle, XCircle, 
  ExternalLink, Filter, Loader2, ArrowLeft, MoreVertical,
  Edit, FileText, User as UserIcon, MessageSquare
} from 'lucide-react';
import { StudyMaterial } from '@/lib/types';
import { materialService } from '@/services/material-service';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminPortal() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [forumPosts, setForumPosts] = useState<any[]>([]);

  const fetchMaterials = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/materials');
      if (res.ok) {
        const json = await res.json();
        setMaterials(json.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch materials", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const json = await res.json();
        setUsers(json.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch users", e);
    }
  };

  const fetchForumPosts = async () => {
    try {
      const res = await fetch('/api/forum');
      if (res.ok) {
        const json = await res.json();
        setForumPosts(json.data || []);
      }
    } catch (e) {
      console.error("Failed to fetch forum posts", e);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`Management Decision: Block & delete user "${name}"?`)) {
      try {
        const res = await fetch(`/api/users?userId=${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast({ title: "User Blocked", description: "Account has been deleted permanently." });
          fetchUsers();
        }
      } catch (e) {
        toast({ title: "Error", description: "Failed to block user.", variant: "destructive" });
      }
    }
  };

  const handleDeleteForumPost = async (id: string, title: string) => {
    if (confirm(`Management Decision: Delete thread "${title}"?`)) {
      try {
        const res = await fetch(`/api/forum/${id}`, { method: 'DELETE' });
        if (res.ok) {
          toast({ title: "Thread Removed", description: "Discussion thread deleted successfully." });
          fetchForumPosts();
        }
      } catch (e) {
        toast({ title: "Error", description: "Failed to delete forum thread.", variant: "destructive" });
      }
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchMaterials();
      fetchUsers();
      fetchForumPosts();
    }
  }, [user]);

  const filteredMaterials = useMemo(() => {
    if (!materials) return [];
    return materials.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.branch.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [materials, searchQuery]);

  // Protect the route
  if (!isUserLoading && user && user.role !== 'admin') {
    router.push('/dashboard');
    return null;
  }

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Verifying Management Access...</p>
      </div>
    );
  }

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      try {
        await materialService.deleteMaterial(id);
        toast({ title: "Resource Deleted", description: "The material has been removed from the platform." });
        fetchMaterials();
      } catch (e) {
        toast({ title: "Error", description: "Failed to delete material.", variant: "destructive" });
      }
    }
  };

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await materialService.updateMaterial(id, { status });
      toast({ title: "Status Updated", description: `Material is now ${status}.` });
      fetchMaterials();
    } catch (e) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl space-y-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-primary/10 pb-10">
        <div className="space-y-4">
          <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 font-black tracking-widest uppercase text-[10px]">
            Security Clearance Level: Admin
          </Badge>
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary tracking-tighter">
            Admin <span className="text-foreground italic">Portal.</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Complete management control over CampusNotes resources, users, and announcements.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="rounded-xl flex-1 md:flex-none h-12" asChild>
            <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Exit Portal</Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-6">
          <Card className="rounded-[2rem] border-primary/5 bg-secondary/10 shadow-sm sticky top-24 overflow-hidden">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg flex items-center gap-2"><Filter className="h-5 w-5" /> Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Materials</p>
                <p className="text-3xl font-black text-primary">{materials?.length || 0}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Pending Approval</p>
                <p className="text-3xl font-black text-accent">{materials?.filter(m => m.status === 'pending').length || 0}</p>
              </div>
              <div className="pt-6 border-t border-primary/5 space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Search Resources</p>
                 <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Title or Author..." 
                      className="pl-10 rounded-xl h-10 bg-background"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                 </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="lg:col-span-3 space-y-8">
          <Tabs defaultValue="materials" className="w-full">
            <TabsList className="grid grid-cols-3 bg-secondary/50 rounded-2xl p-1 mb-8">
              <TabsTrigger value="materials" className="rounded-xl font-bold py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Study Materials</TabsTrigger>
              <TabsTrigger value="forums" className="rounded-xl font-bold py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Forum Moderation</TabsTrigger>
              <TabsTrigger value="users" className="rounded-xl font-bold py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">User Management</TabsTrigger>
            </TabsList>

            <TabsContent value="materials" className="space-y-6 focus-visible:ring-0">
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                  <FileText className="h-5 w-5" /> Managed Resources
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {isLoading ? (
                    [1,2,3].map(i => <Card key={i} className="h-24 rounded-2xl animate-pulse bg-muted" />)
                  ) : filteredMaterials.length > 0 ? (
                    filteredMaterials.map(m => (
                      <Card key={m.id} className="rounded-2xl border-primary/5 hover:border-primary/20 transition-all overflow-hidden group">
                        <div className="flex flex-col md:flex-row items-center p-4 gap-6">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <FileText className="h-6 w-6" />
                          </div>
                          
                          <div className="flex-grow space-y-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                              <h4 className="font-bold text-base">{m.title}</h4>
                              <Badge variant="outline" className="text-[9px] px-2 py-0 border-primary/20">{m.branch}</Badge>
                              <Badge className={`text-[9px] px-2 py-0 border-none ${m.status === 'approved' ? 'bg-green-500/20 text-green-600' : 'bg-yellow-500/20 text-yellow-600'}`}>
                                {m.status.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center justify-center md:justify-start gap-1">
                              <UserIcon className="h-3 w-3" /> Shared by {m.author} • Sem {m.semester}
                            </p>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-green-500/10 hover:text-green-600" title="Approve" onClick={() => handleStatusChange(m.id, 'approved')}>
                              <CheckCircle className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-yellow-500/10 hover:text-yellow-600" title="Reject" onClick={() => handleStatusChange(m.id, 'rejected')}>
                              <XCircle className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-destructive/10 hover:text-destructive" title="Delete" onClick={() => handleDelete(m.id, m.title)}>
                              <Trash2 className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full" asChild title="View Details">
                              <Link href={`/material/${m.id}`}><ExternalLink className="h-5 w-5" /></Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-secondary/5 rounded-[2rem] border-2 border-dashed border-primary/10 space-y-4">
                      <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto opacity-20">
                        <FileText className="h-8 w-8" />
                      </div>
                      <p className="text-muted-foreground font-bold">No resources found matching your search.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="forums" className="space-y-6 focus-visible:ring-0">
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                  <MessageSquare className="h-5 w-5" /> Moderate Campus Forum Threads
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {forumPosts.length > 0 ? (
                    forumPosts.map(post => (
                      <Card key={post.id} className="rounded-2xl border-primary/5 p-4 flex justify-between items-center bg-card border group hover:border-primary/20 transition-all">
                        <div className="space-y-1">
                          <h4 className="font-bold text-base text-primary">{post.title}</h4>
                          <p className="text-xs text-muted-foreground">Shared by <span className="text-foreground font-semibold">{post.authorName}</span> • Branch: {post.branch}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1 italic">"{post.content}"</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteForumPost(post.id, post.title)}>
                            <Trash2 className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="rounded-full text-primary" asChild>
                            <Link href={`/forum/${post.id}`}><ExternalLink className="h-5 w-5" /></Link>
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-secondary/5 rounded-[2rem] border-2 border-dashed border-primary/10">
                      <p className="text-muted-foreground font-bold">No forum threads found.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6 focus-visible:ring-0">
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                  <UserIcon className="h-5 w-5" /> Registered Users Management
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {users.length > 0 ? (
                    users.map(u => (
                      <Card key={u.id} className="rounded-2xl border-primary/5 p-4 flex justify-between items-center bg-card border group hover:border-primary/20 transition-all">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-base">{u.fullName}</h4>
                            <Badge variant="outline" className="text-[10px] uppercase font-bold bg-primary/5 text-primary border-none">{u.role}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Email: {u.email} • Username: {u.username}</p>
                        </div>
                        <div>
                          {u.email.toLowerCase() !== (user?.email || '').toLowerCase() ? (
                            <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteUser(u.id, u.fullName)}>
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          ) : (
                            <Badge className="text-[10px] font-bold bg-emerald-500/20 text-emerald-600 border-none">YOU</Badge>
                          )}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-secondary/5 rounded-[2rem] border-2 border-dashed border-primary/10">
                      <p className="text-muted-foreground font-bold">No registered users found.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
