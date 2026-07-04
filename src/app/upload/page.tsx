
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
import { Upload, CheckCircle2, AlertCircle, Loader2, UserCircle, FileText, Zap, GraduationCap } from 'lucide-react';
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
    
    if (!formData.branch || !formData.title || !formData.description) {
      toast({ title: "Validation Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    if (formData.type !== 'YouTube Playlist' && !selectedFile) {
      toast({ title: "File Required", description: "Please select a PDF or image file to upload.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    
    try {
      const uploaderId = user?.uid || 'anonymous';
      const authorName = formData.author || user?.displayName || user?.email?.split('@')[0] || 'Anonymous Student';

      // Actual publishing to Firestore
      await materialService.uploadMaterial({
        title: formData.title,
        description: formData.description,
        branch: formData.branch,
        semester: formData.semester,
        type: formData.type,
        author: authorName,
        uploaderId: uploaderId,
        fileUrl: formData.type === 'YouTube Playlist' ? formData.fileUrl : 'https://placehold.co/600x400/064e3b/ffffff?text=PDF+Material',
        status: 'approved',
        createdAt: new Date().toISOString()
      });
      
      setIsSuccess(true);
      toast({
        title: "Material Published!",
        description: "Your contribution has been added to the vault.",
      });
      
      setTimeout(() => router.push('/browse'), 2000);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "An unexpected error occurred while publishing.",
        variant: "destructive"
      });
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center text-center gap-8 animate-in fade-in zoom-in duration-700">
        <div className="relative">
          <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
          <div className="absolute -inset-4 border border-primary/20 rounded-full animate-ping opacity-20" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-primary">Contribution Successful!</h1>
          <p className="text-muted-foreground max-w-md mx-auto">Thank you for helping the NIT Srinagar community. Your material is now live in the vault.</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/browse')} className="rounded-full px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20">Go to Vault</Button>
          <Button variant="outline" onClick={() => { setIsSuccess(false); setFormData({...formData, title: '', description: ''}); setSelectedFile(null); }} className="rounded-full px-10 h-14 text-lg font-bold border-primary/20">Upload Another</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 mb-4 shadow-sm">
          <Zap className="h-3 w-3" /> Community Resource
        </div>
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary">Share Study <span className="text-foreground italic">Material</span></h1>
        <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
          Contribute to the largest peer-to-peer repository for NIT Srinagar. Your single share helps hundreds of peers.
        </p>
      </div>

      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card border border-primary/5">
        <CardHeader className="bg-primary text-primary-foreground p-8 md:p-14 relative overflow-hidden">
           <div className="absolute -top-10 -right-10 p-8 opacity-10">
              <GraduationCap className="h-64 w-64" />
           </div>
           <CardTitle className="font-headline text-3xl md:text-4xl relative z-10">Resource Details</CardTitle>
           <CardDescription className="text-primary-foreground/80 relative z-10 text-base">Accurate metadata ensures your notes are discovered by the right students.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 md:p-14">
          <form onSubmit={handleUpload} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Resource Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Applied Physics II Mid-Sem Notes" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-secondary/40 border-primary/5 rounded-2xl h-14 focus-visible:ring-primary shadow-sm"
                  required 
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="author" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Contributor Name</Label>
                <Input 
                  id="author" 
                  placeholder="e.g. Student Name (Optional)" 
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="bg-secondary/40 border-primary/5 rounded-2xl h-14 focus-visible:ring-primary shadow-sm"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="branch" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Academic Branch</Label>
                <Select onValueChange={(v) => setFormData({...formData, branch: v as Branch})} required>
                  <SelectTrigger id="branch" className="bg-secondary/40 border-primary/5 rounded-2xl h-14">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label htmlFor="semester" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Semester</Label>
                <Select onValueChange={(v) => setFormData({...formData, semester: parseInt(v) as Semester})} required>
                  <SelectTrigger id="semester" className="bg-secondary/40 border-primary/5 rounded-2xl h-14">
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    {SEMESTERS.map(s => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Resource Type</Label>
              <Select onValueChange={(v) => setFormData({...formData, type: v as MaterialType})} defaultValue="Note">
                <SelectTrigger id="type" className="bg-secondary/40 border-primary/5 rounded-2xl h-14">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="Note">Handwritten Note</SelectItem>
                  <SelectItem value="Assignment">Assignment Solution</SelectItem>
                  <SelectItem value="Previous Year Paper">Previous Year Paper</SelectItem>
                  <SelectItem value="Textbook">E-Textbook</SelectItem>
                  <SelectItem value="Lab Manual">Lab Manual</SelectItem>
                  <SelectItem value="YouTube Playlist">Video Series (YouTube)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Content Description</Label>
              <Textarea 
                id="description" 
                placeholder="Brief summary of the topics covered..."
                className="min-h-[160px] bg-secondary/40 border-primary/5 rounded-3xl p-6 focus-visible:ring-primary shadow-sm leading-relaxed"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">
                {formData.type === 'YouTube Playlist' ? 'Playlist URL' : 'File Attachment'}
              </Label>
              {formData.type === 'YouTube Playlist' ? (
                <div className="space-y-3">
                  <Input 
                    placeholder="https://www.youtube.com/playlist?list=..." 
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                    className="bg-secondary/40 border-primary/5 rounded-2xl h-14 focus-visible:ring-primary shadow-sm"
                    required
                  />
                </div>
              ) : (
                <div className="relative group">
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                  <div className={`border-2 border-dashed rounded-[2.5rem] p-16 text-center space-y-4 transition-all duration-300 ${selectedFile ? 'border-primary bg-primary/[0.03]' : 'border-primary/10 hover:border-primary/40 hover:bg-primary/[0.02]'}`}>
                    <div className={`bg-primary/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto transition-all transform ${selectedFile ? 'scale-110 bg-primary text-white' : 'group-hover:scale-110'}`}>
                      {selectedFile ? <CheckCircle2 className="h-12 w-12" /> : <Upload className="h-12 w-12 text-primary" />}
                    </div>
                    <div className="space-y-2">
                      <p className="font-black text-primary text-xl">
                        {selectedFile ? selectedFile.name : 'Click or Drag to Upload'}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">
                        {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'PDF, DOCX, or Images (Max 20MB)'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full h-20 rounded-full text-2xl font-black shadow-2xl shadow-primary/20 hover:scale-[1.01] transition-transform active:scale-95" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-3 h-8 w-8 animate-spin" />
                  Publishing to Vault...
                </>
              ) : (
                <>
                  Publish Resource <Zap className="ml-3 h-6 w-6 fill-current" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
