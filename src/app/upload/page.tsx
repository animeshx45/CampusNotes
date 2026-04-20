
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
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UploadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
      toast({
        title: "Material Uploaded!",
        description: "Your contribution has been added and will be visible after a quick review.",
      });
      
      // Redirect after success
      setTimeout(() => router.push('/browse'), 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto py-20 flex flex-col items-center justify-center text-center gap-6 animate-in fade-in zoom-in duration-500">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-headline font-bold text-primary">Contribution Successful!</h1>
        <p className="text-muted-foreground max-w-md">Thank you for helping your peers. Your material will be reviewed and published shortly.</p>
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
                <Input id="title" placeholder="e.g. Applied Physics II Complete Notes" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author" className="font-bold">Author Name</Label>
                <Input id="author" placeholder="Your name or anonymous" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch" className="font-bold">Academic Branch</Label>
                <Select required>
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
                <Select required>
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
              <Label htmlFor="description" className="font-bold">Short Description</Label>
              <Textarea 
                id="description" 
                placeholder="Briefly describe what's inside these notes (chapters covered, importance for exams, etc.)"
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-4">
              <Label className="font-bold">File Upload</Label>
              <div className="border-2 border-dashed border-muted-foreground/20 rounded-2xl p-12 text-center space-y-4 hover:border-accent hover:bg-accent/5 transition-all group cursor-pointer">
                <div className="bg-secondary p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto group-hover:bg-accent group-hover:text-white transition-colors">
                  <Upload className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-primary">Click or drag to upload</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max 20MB)</p>
                </div>
                <input type="file" className="hidden" id="file-input" />
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
                  Uploading Resource...
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
