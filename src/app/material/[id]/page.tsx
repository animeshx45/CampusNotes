"use client";

import { useState, use, useEffect } from 'react';
import { StudyMaterial } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, Download, FileText, Share2, MessageSquare, Info, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { generateStudyMaterialSummary } from '@/ai/flows/generate-study-material-summary';
import { generateExamQuestions } from '@/ai/flows/generate-exam-questions-flow';
import { useToast } from '@/hooks/use-toast';
import { materialService } from '@/services/material-service';
import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';

export default function MaterialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const db = useFirestore();

  const materialRef = useMemoFirebase(() => {
    if (!db || !id) return null;
    return doc(db, 'studyMaterials', id);
  }, [db, id]);

  const { data: material, isLoading } = useDoc<StudyMaterial>(materialRef);

  const [summary, setSummary] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  useEffect(() => {
    if (material) {
      materialService.incrementViewCount(id);
    }
  }, [material, id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Fetching details...</p>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="container mx-auto py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Material not found</h1>
        <Button asChild><Link href="/browse">Back to Browse</Link></Button>
      </div>
    );
  }

  const handleDownload = () => {
    materialService.incrementDownloadCount(id);
    window.open(material.fileUrl, '_blank');
  };

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const result = await generateStudyMaterialSummary({ 
        studyMaterialContent: `${material.title}. ${material.description}` 
      });
      setSummary(result.summary);
    } catch (error) {
      toast({ title: "Error generating summary", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleGenerateQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      const result = await generateExamQuestions({ 
        studyMaterialText: `${material.title}. ${material.description}` 
      });
      setQuestions(result.examQuestions);
    } catch (error) {
      toast({ title: "Error generating questions", description: "Please try again later.", variant: "destructive" });
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const formatDate = (date: any) => {
    if (date instanceof Timestamp) return date.toDate().toLocaleDateString();
    if (typeof date === 'string') return new Date(date).toLocaleDateString();
    return new Date().toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b pb-8">
        <div className="space-y-4 flex-grow">
          <div className="flex items-center gap-3">
            <Badge className="bg-accent text-white border-none">{material.branch}</Badge>
            <Badge variant="outline">Semester {material.semester}</Badge>
            <Badge variant="secondary">{material.type}</Badge>
          </div>
          <h1 className="text-4xl font-headline font-bold text-primary leading-tight">{material.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1"><FileText className="h-4 w-4" /> Shared by {material.author}</div>
            <div className="flex items-center gap-1"><Info className="h-4 w-4" /> {formatDate(material.createdAt)}</div>
            <div className="flex items-center gap-1"><Download className="h-4 w-4" /> {material.downloadCount || 0} downloads</div>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button variant="outline" size="icon" className="rounded-full"><Share2 className="h-4 w-4" /></Button>
          <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20" onClick={handleDownload}>
            <Download className="mr-2 h-5 w-5" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm bg-white dark:bg-card">
            <CardHeader>
              <CardTitle className="font-headline font-bold">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {material.description}
              </p>
              <div className="mt-8 bg-secondary p-6 rounded-2xl flex items-center gap-4 text-sm">
                <AlertCircle className="text-primary shrink-0" />
                <p>Ensure you check the syllabus version before relying solely on these notes for exams.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white dark:bg-card">
            <CardHeader>
              <CardTitle className="font-headline font-bold">Material Preview</CardTitle>
              <CardDescription>A snippet of the content is available below.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-[4/3] bg-muted rounded-xl flex items-center justify-center border-2 border-dashed">
                <div className="text-center space-y-2">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Preview not available for this format.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-none shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <BrainCircuit className="h-24 w-24" />
            </div>
            <CardHeader>
              <CardTitle className="font-headline font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                AI Study Aid
              </CardTitle>
              <CardDescription className="text-primary-foreground/70">
                Leverage AI to help you revise faster.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="w-full grid grid-cols-2 bg-primary-foreground/10 mb-4 border-none">
                  <TabsTrigger value="summary" className="data-[state=active]:bg-accent data-[state=active]:text-white">Summary</TabsTrigger>
                  <TabsTrigger value="questions" className="data-[state=active]:bg-accent data-[state=active]:text-white">Mock Qs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="min-h-[200px]">
                  {summary ? (
                    <div className="text-sm bg-white/10 p-4 rounded-xl leading-relaxed whitespace-pre-wrap animate-in fade-in zoom-in duration-300">
                      {summary}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                      <BrainCircuit className="h-10 w-10 opacity-30" />
                      <p className="text-sm text-primary-foreground/60">Generate a concise summary of these notes.</p>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-full px-6"
                        onClick={handleGenerateSummary}
                        disabled={isLoadingSummary}
                      >
                        {isLoadingSummary ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        Generate Summary
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="questions" className="min-h-[200px]">
                  {questions ? (
                    <ul className="space-y-3 animate-in fade-in slide-in-from-bottom duration-300">
                      {questions.map((q, i) => (
                        <li key={i} className="text-sm bg-white/10 p-3 rounded-xl flex gap-2">
                          <span className="font-bold text-accent">Q{i+1}:</span> {q}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                      <MessageSquare className="h-10 w-10 opacity-30" />
                      <p className="text-sm text-primary-foreground/60">Generate potential exam questions from this material.</p>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="rounded-full px-6"
                        onClick={handleGenerateQuestions}
                        disabled={isLoadingQuestions}
                      >
                        {isLoadingQuestions ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        Generate Questions
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
