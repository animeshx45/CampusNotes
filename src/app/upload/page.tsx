
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BRANCHES, SEMESTERS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, CheckCircle2, AlertCircle, Loader2, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { materialService } from '@/services/material-service';
import { useUser } from '@/firebase';
import { Branch, MaterialType, Semester } from '@/lib/types';

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    branch: '' as Branch,
    semester: 1 as Semester,
    type: 'Note' as MaterialType,
    author: user?.displayName || user?.email?.split('@')[0] || 'Anonymous',
    fileUrl: '',
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branch || !formData.title || !formData.description) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    
    // Allow anonymous uploaderId if user is not logged in
    const uploaderId = user?.uid || 'anonymous';

    materialService.uploadMaterial({
      title: formData.title,
      description: formData.description,
      branch: formData.branch,
      semester: formData.semester,
      type: formData.type,
      author: formData.author,
      uploaderId: uploaderId,
      fileUrl: formData.type === 'YouTube Playlist' ? formData.fileUrl : 'https://placehold.co/600x400/064e3b/ffffff?text=PDF+Material',
      branchId: formData.branch,
      semesterId: formData.semester.toString(),
      materialTypeId: formData.type,
    });
    
    setIsSuccess(true);
    toast({
      title: "Material Published!",
      description: "Your contribution has been added successfully.",
    });
    setTimeout(() => router.push('/browse'), 2000);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center text-center gap-6 animate-in fade-in zoom-in duration-500">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-3xl font-headline font-bold text-primary">Contribution Successful!</h1>
        <p className="text-muted-foreground max-w-md">Thank you for helping your peers. Your material is now live in the repository.</p>
        <Button onClick={() => router.push('/browse')} className="rounded-full px-8 h-12 text-lg font-bold">Go to Browse</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20 mb-4">
          Community Contribution
        </div>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">Share Study Material</h1>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
          Help your fellow NITians excel. You can now contribute resources anonymously or sign in to track your impact.
        </p>
      </div>

      {!user && (
        <Card className="mb-8 border-dashed border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-bold text-primary">Sharing Anonymously</p>
                <p className="text-xs text-muted-foreground">Your upload will be visible to everyone, but you won't be able to edit it later.</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/login')} className="rounded-full border-primary/20 hover:bg-primary hover:text-white">
              Sign in to track impact
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card">
        <CardHeader className="bg-primary text-primary-foreground p-8 md:p-12 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Upload className="h-32 w-32" />
           </div>
           <CardTitle className="font-headline text-2xl md:text-3xl relative z-10">Material Details</CardTitle>
           <CardDescription className="text-primary-foreground/70 relative z-10">Accurate categorization helps other students find your notes faster.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 md:p-12">
          <form onSubmit={handleUpload} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Resource Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Applied Physics II Complete Notes" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-secondary/50 border-none rounded-xl h-12 focus-visible:ring-primary"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Display Name</Label>
                <Input 
                  id="author" 
                  placeholder="Your name (e.g. Animesh)" 
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="bg-secondary/50 border-none rounded-xl h-12 focus-visible:ring-primary"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Academic Branch</Label>
                <Select onValueChange={(v) => setFormData({...formData, branch: v as Branch})} required>
                  <SelectTrigger id="branch" className="bg-secondary/50 border-none rounded-xl h-12">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Semester</Label>
                <Select onValueChange={(v) => setFormData({...formData, semester: parseInt(v) as Semester})} required>
                  <SelectTrigger id="semester" className="bg-secondary/50 border-none rounded-xl h-12">
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {SEMESTERS.map(s => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Resource Type</Label>
              <Select onValueChange={(v) => setFormData({...formData, type: v as MaterialType})} defaultValue="Note">
                <SelectTrigger id="type" className="bg-secondary/50 border-none rounded-xl h-12">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Note">Handwritten Note</SelectItem>
                  <SelectItem value="Assignment">Assignment Solution</SelectItem>
                  <SelectItem value="Previous Year Paper">Previous Year Paper</SelectItem>
                  <SelectItem value="Textbook">E-Textbook</SelectItem>
                  <SelectItem value="Lab Manual">Lab Manual</SelectItem>
                  <SelectItem value="YouTube Playlist">Video Series (YouTube)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Short Description</Label>
              <Textarea 
                id="description" 
                placeholder="Briefly describe what's inside (e.g. Unit 1-4 covered, focused on Mid-term exams)"
                className="min-h-[150px] bg-secondary/50 border-none rounded-2xl p-4 focus-visible:ring-primary"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">
                {formData.type === 'YouTube Playlist' ? 'Playlist URL' : 'File Reference'}
              </Label>
              {formData.type === 'YouTube Playlist' ? (
                <div className="space-y-2">
                  <Input 
                    placeholder="https://www.youtube.com/playlist?list=..." 
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                    className="bg-secondary/50 border-none rounded-xl h-12 focus-visible:ring-primary"
                    required
                  />
                  <p className="text-[10px] text-muted-foreground italic px-2">Paste the link to the YouTube playlist here.</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-primary/10 rounded-[2rem] p-12 text-center space-y-4 hover:border-primary/40 hover:bg-primary/[0.02] transition-all group cursor-pointer relative">
                  <div className="bg-primary/10 p-5 rounded-full w-20 h-20 flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110">
                    <Upload className="h-10 w-10" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-primary text-lg">Click to select files</p>
                    <p className="text-xs text-muted-foreground">Supported: PDF, DOCX, JPG (Max 20MB)</p>
                  </div>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" disabled />
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 bg-primary/5 p-6 rounded-2xl text-xs text-muted-foreground border border-primary/10">
              <AlertCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-primary">Academic Integrity</p>
                <p>By publishing, you confirm that this material is your own or you have permission to share it. Avoid sharing official internal question papers before the exam concludes.</p>
              </div>
            </div>

            <Button type="submit" className="w-full h-16 rounded-full text-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Publishing Resource...
                </>
              ) : (
                "Publish to Vault"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
