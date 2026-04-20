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
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
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
  });

  if (!user) {
    return (
      <div className="container mx-auto py-32 text-center space-y-6">
        <h1 className="text-3xl font-headline font-bold text-primary">Sign in to Upload</h1>
        <p className="text-muted-foreground">You need to be logged in to contribute study materials.</p>
        <Button onClick={() => router.push('/login')} className="rounded-full">Go to Login</Button>
      </div>
    );
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branch || !formData.title || !formData.description) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    
    // Using non-blocking service method
    materialService.uploadMaterial({
      title: formData.title,
      description: formData.description,
      branch: formData.branch,
      semester: formData.semester,
      type: formData.type,
      author: formData.author,
      uploaderId: user.uid,
      fileUrl: 'https://example.com/placeholder-pdf',
      branchId: formData.branch,
      semesterId: formData.semester.toString(),
      materialTypeId: formData.type,
    });
    
    // We optimistically show success
    setIsSuccess(true);
    toast({
      title: "Material Uploaded!",
      description: "Your contribution has been added successfully.",
    });
    setTimeout(() => router.push('/browse'), 2000);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center text-center gap-6 animate-in fade-in zoom-in duration-500">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-headline font-bold text-primary">Contribution Successful!</h1>
        <p className="text-muted-foreground max-w-md">Thank you for helping your peers. Your material is now live.</p>
        <Button onClick={() => router.push('/browse')} className="rounded-full">Go to Browse</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-headline font-bold text-primary">Contribute Study Material</h1>
        <p className="text-muted-foreground">Share your notes, assignments, or previous year papers with the NIT Srinagar community.</p>
      </div>

      <Card className="border-none shadow-lg overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-8">
           <CardTitle className="font-headline text-2xl">Material Details</CardTitle>
           <CardDescription className="text-primary-foreground/70">Fill out the information below to categorize your resource.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleUpload} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-bold">Resource Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Applied Physics II Complete Notes" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author" className="font-bold">Author Display Name</Label>
                <Input 
                  id="author" 
                  placeholder="Your name or anonymous" 
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch" className="font-bold">Academic Branch</Label>
                <Select onValueChange={(v) => setFormData({...formData, branch: v as Branch})} required>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester" className="font-bold">Semester</Label>
                <Select onValueChange={(v) => setFormData({...formData, semester: parseInt(v) as Semester})} required>
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTERS.map(s => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="font-bold">Resource Type</Label>
              <Select onValueChange={(v) => setFormData({...formData, type: v as MaterialType})} defaultValue="Note">
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Note">Note</SelectItem>
                  <SelectItem value="Assignment">Assignment</SelectItem>
                  <SelectItem value="Previous Year Paper">Previous Year Paper</SelectItem>
                  <SelectItem value="Textbook">Textbook</SelectItem>
                  <SelectItem value="Lab Manual">Lab Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-bold">Short Description</Label>
              <Textarea 
                id="description" 
                placeholder="Briefly describe what's inside these notes"
                className="min-h-[120px]"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="space-y-4">
              <Label className="font-bold">File Upload</Label>
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-2xl p-12 text-center space-y-4 hover:border-accent hover:bg-accent/5 transition-all group cursor-pointer relative">
                <div className="bg-secondary p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto group-hover:bg-accent group-hover:text-white transition-colors">
                  <Upload className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-primary">Click or drag to upload</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 20MB)</p>
                </div>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" disabled />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-secondary p-4 rounded-xl text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4 shrink-0 text-primary" />
              <p>By uploading, you agree that you have the right to share this material and that it doesn't violate any academic integrity policies of NIT Srinagar.</p>
            </div>

            <Button type="submit" className="w-full h-14 rounded-full text-lg font-bold shadow-lg" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Publishing Resource...
                </>
              ) : (
                "Publish Study Material"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
