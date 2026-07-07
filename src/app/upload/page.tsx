
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
import { Upload, CheckCircle2, Loader2, Zap, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { materialService } from '@/services/material-service';
import { Branch, MaterialType, Semester } from '@/lib/types';

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    branch: '' as Branch,
    semester: 1 as Semester,
    type: 'Note' as MaterialType,
    author: '',
    fileUrl: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.branch || !formData.title || !formData.description || !formData.author) {
      toast({ title: "Wait!", description: "Please fill in all the details including your name.", variant: "destructive" });
      return;
    }

    if (formData.type !== 'YouTube Playlist' && !selectedFile) {
      toast({ title: "No file!", description: "Please pick a file to upload.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    
    try {
      await materialService.uploadMaterial({
        title: formData.title,
        description: formData.description,
        branch: formData.branch,
        semester: formData.semester,
        type: formData.type,
        author: formData.author,
        uploaderId: 'public-user',
        fileUrl: formData.type === 'YouTube Playlist' ? formData.fileUrl : 'https://placehold.co/600x400/064e3b/ffffff?text=Study+Notes',
        status: 'approved',
        createdAt: new Date().toISOString()
      });
      
      setIsSuccess(true);
      toast({
        title: "Done!",
        description: "Your notes have been shared with everyone.",
      });
      
      setTimeout(() => router.push('/browse'), 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center text-center gap-8 animate-in fade-in zoom-in duration-500">
        <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="h-16 w-16 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary">Notes Shared Successfully!</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Thanks for helping out. Your notes are now in the library for everyone to see.</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/browse')} className="rounded-xl px-8 h-12 font-bold">Go to Library</Button>
          <Button variant="outline" onClick={() => setIsSuccess(false)} className="rounded-xl px-8 h-12 border-primary/20">Upload More</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-primary">Share Your <span className="text-foreground">Notes</span></h1>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto font-medium">
          Help your fellow students at NIT Srinagar. No account needed!
        </p>
      </div>

      <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-card border border-primary/5">
        <CardHeader className="bg-primary text-primary-foreground p-8 relative overflow-hidden">
           <div className="absolute -top-10 -right-10 p-8 opacity-10">
              <GraduationCap className="h-48 w-48" />
           </div>
           <CardTitle className="text-2xl relative z-10 font-bold">Resource Details</CardTitle>
           <CardDescription className="text-primary-foreground/80 relative z-10 font-medium">Add some simple details so others can find your work easily.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleUpload} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Physics Mid-Sem Notes" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contributor Name</Label>
                <Input 
                  id="author" 
                  placeholder="Your Name (e.g. Animesh Kumar)" 
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department</Label>
                <Select onValueChange={(v) => setFormData({...formData, branch: v as Branch})} required>
                  <SelectTrigger id="branch" className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner">
                    <SelectValue placeholder="Which branch?" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Semester</Label>
                <Select onValueChange={(v) => setFormData({...formData, semester: parseInt(v) as Semester})} required>
                  <SelectTrigger id="semester" className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner">
                    <SelectValue placeholder="Which semester?" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map(s => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Note Type</Label>
              <Select onValueChange={(v) => setFormData({...formData, type: v as MaterialType})} defaultValue="Note">
                <SelectTrigger id="type" className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner">
                  <SelectValue placeholder="What is this?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Note">Handwritten Note</SelectItem>
                  <SelectItem value="Assignment">Assignment</SelectItem>
                  <SelectItem value="Previous Year Paper">Old Exam Paper</SelectItem>
                  <SelectItem value="Textbook">Book / PDF</SelectItem>
                  <SelectItem value="Lab Manual">Lab Manual</SelectItem>
                  <SelectItem value="YouTube Playlist">YouTube Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Brief Description</Label>
              <Textarea 
                id="description" 
                placeholder="What is inside this file?"
                className="min-h-[120px] rounded-xl p-4 bg-secondary/20 border-none shadow-inner"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {formData.type === 'YouTube Playlist' ? 'Link to Video' : 'Pick Your File'}
              </Label>
              {formData.type === 'YouTube Playlist' ? (
                <Input 
                  placeholder="https://www.youtube.com/..." 
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                  className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner"
                  required
                />
              ) : (
                <div className="relative border-2 border-dashed rounded-2xl p-10 text-center hover:border-primary transition-colors group cursor-pointer bg-secondary/5">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.png"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-primary mb-2" />
                    <p className="font-bold">{selectedFile ? selectedFile.name : 'Click to Pick a File'}</p>
                    <p className="text-xs text-muted-foreground">PDF, Images (Max 20MB)</p>
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full h-16 rounded-xl text-lg font-black bg-primary shadow-xl hover:scale-[1.02] transition-transform" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Syncing Knowledge...
                </>
              ) : (
                <>
                  Publish for Everyone <Zap className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
