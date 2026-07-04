
"use client";

import { useState, use, useEffect, useMemo } from 'react';
import { StudyMaterial } from '@/lib/types';
import { MOCK_MATERIALS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrainCircuit, Download, FileText, Share2, MessageSquare, Info, Sparkles, AlertCircle, Loader2, Zap, ArrowLeft, ExternalLink, Youtube } from 'lucide-react';
import { generateStudyMaterialSummary } from '@/ai/flows/generate-study-material-summary';
import { generateExamQuestions } from '@/ai/flows/generate-exam-questions-flow';
import { useToast } from '@/hooks/use-toast';
import { materialService } from '@/services/material-service';
import Link from 'next/link';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const ModernLoader = ({ message }: { message: string }) => (
  <div className="container mx-auto px-4 py-40 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
    <div className="relative h-20 w-20">
      <div className="absolute inset-0 rounded-full border-b-2 border-primary animate-spin" />
      <div className="absolute inset-2 rounded-full border-r-2 border-accent animate-spin [animation-duration:1.5s]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Zap className="h-8 w-8 text-primary animate-pulse" />
      </div>
    </div>
    <p className="text-muted-foreground font-headline font-bold uppercase tracking-widest text-xs animate-pulse">
      {message}
    </p>
  </div>
);

export default function MaterialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();
  const db = useFirestore();

  const mockMaterial = useMemo(() => MOCK_MATERIALS.find(m => m.id === id), [id]);

  const materialRef = useMemoFirebase(() => {
    if (!db || !id || id.startsWith('yt-')) return null;
    return doc(db, 'studyMaterials', id);
  }, [db, id]);

  const { data: dbMaterial, isLoading } = useDoc<StudyMaterial>(materialRef);

  const material = mockMaterial || dbMaterial;

  const [summary, setSummary] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  useEffect(() => {
    if (material) {
      materialService.incrementViewCount(id);
    }
  }, [material, id]);

  if (isLoading && !mockMaterial) return <ModernLoader message="Decoding material..." />;

  if (!material) {
    return (
      <div className="container mx-auto py-20 text-center space-y-6">
        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold text-primary">Material not found</h1>
          <p className="text-muted-foreground">The resource you're looking for might have been moved or deleted.</p>
        </div>
        <Button asChild className="rounded-full px-8 h-12">
          <Link href="/browse"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Vault</Link>
        </Button>
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
    if (!date) return 'Recently';
    if (date instanceof Timestamp) return date.toDate().toLocaleDateString();
    if (typeof date === 'string') return new Date(date).toLocaleDateString();
    if (date?.seconds) return new Date(date.seconds * 1000).toLocaleDateString();
    return new Date().toLocaleDateString();
  };

  const isYoutube = material.type === 'YouTube Playlist';
  const isImagePlaceholder = material.fileUrl?.includes('placehold.co');

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-primary/10 pb-8">
        <div className="space-y-4 flex-grow">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary text-white border-none">{material.branch}</Badge>
            <Badge variant="outline" className="border-primary/20">Sem {material.semester}</Badge>
            <Badge variant="secondary" className={cn(
              "font-bold",
              isYoutube ? "bg-red-500/10 text-red-500" : "bg-secondary text-primary"
            )}>
              {isYoutube && <Youtube className="h-3 w-3 mr-1 inline" />}
              {material.type}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-headline font-bold text-primary leading-tight">{material.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5"><FileText className="h-4 w-4" /> Shared by <span className="font-bold text-foreground">{material.author}</span></div>
            <div className="flex items-center gap-1.5"><Info className="h-4 w-4" /> {formatDate(material.createdAt)}</div>
            <div className="flex items-center gap-1.5"><Download className="h-4 w-4" /> {material.downloadCount || 0} downloads</div>
          </div>
        </div>
        <div className="flex gap-3 shrink-0 w-full md:w-auto">
          <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/5 h-12 w-12"><Share2 className="h-5 w-5" /></Button>
          <Button size="lg" className="rounded-full px-8 h-12 shadow-lg shadow-primary/20 flex-1 md:flex-none font-bold text-base" onClick={handleDownload}>
            {isYoutube ? <ExternalLink className="mr-2 h-5 w-5" /> : <Download className="mr-2 h-5 w-5" />}
            {isYoutube ? 'Visit Playlist' : 'Download PDF'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl bg-card rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="font-headline font-bold text-primary flex items-center gap-2">
                <FileText className="h-5 w-5" /> Resource Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-muted-foreground leading-relaxed text-lg">
                {material.description}
              </p>
              <div className="mt-8 bg-secondary/50 p-6 rounded-2xl flex items-center gap-4 text-sm border border-primary/10">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                   <AlertCircle className="text-primary h-6 w-6" />
                </div>
                <p className="font-medium">Ensure you verify this content with your current academic syllabus before examinations.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="font-headline font-bold text-primary">
                {isYoutube ? 'Video Preview' : 'Material Preview'}
              </CardTitle>
              <CardDescription>
                {isYoutube ? 'Curated educational video series.' : 'Visual snippet of the resource.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {isYoutube ? (
                <div className="aspect-video bg-black rounded-[1.5rem] flex items-center justify-center overflow-hidden border border-primary/20 shadow-2xl relative group">
                   <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-50" />
                   <div className="text-center space-y-4 z-10">
                      <div className="h-20 w-20 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                        <Youtube className="h-10 w-10 text-white" />
                      </div>
                      <p className="text-white font-headline font-bold text-xl">YouTube Study Hub</p>
                      <Button variant="secondary" className="rounded-full" asChild>
                        <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">Open on YouTube <ExternalLink className="ml-2 h-4 w-4" /></a>
                      </Button>
                   </div>
                </div>
              ) : isImagePlaceholder ? (
                <div className="aspect-[16/10] relative rounded-[1.5rem] overflow-hidden border border-primary/10 shadow-lg bg-secondary/20">
                  <Image 
                    src={material.fileUrl} 
                    alt="Material Placeholder" 
                    fill 
                    className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/40 backdrop-blur-sm">
                    <FileText className="h-12 w-12 text-white mb-4 opacity-80" />
                    <p className="text-white font-bold text-lg mb-2">Resource Preview Available</p>
                    <p className="text-white/70 text-sm max-w-xs">Detailed document content can be accessed by clicking the download button above.</p>
                  </div>
                </div>
              ) : (
                <div className="aspect-[16/10] bg-muted/30 rounded-[1.5rem] flex items-center justify-center border-2 border-dashed border-primary/10 group hover:border-primary/40 transition-all overflow-hidden relative">
                  <iframe 
                    src={material.fileUrl} 
                    className="w-full h-full border-none opacity-80 group-hover:opacity-100 transition-opacity"
                    title="Document Preview"
                  />
                  {!material.fileUrl && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-3 p-4">
                      <div className="h-16 w-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <FileText className="h-8 w-8 text-primary opacity-50" />
                      </div>
                      <p className="text-sm font-bold text-muted-foreground">Preview unavailable for this format.</p>
                      <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/60">Click Download to View</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground border-none shadow-2xl overflow-hidden relative rounded-[2rem] group">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <BrainCircuit className="h-32 w-32" />
            </div>
            <CardHeader className="relative z-10 border-b border-white/10 pb-6">
              <CardTitle className="font-headline font-bold text-xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-accent animate-pulse" />
                AI Study Engine
              </CardTitle>
              <CardDescription className="text-primary-foreground/70 font-medium">
                Deep analysis & revision tools.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 relative z-10">
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="w-full grid grid-cols-2 bg-primary-foreground/10 mb-6 border-none p-1 rounded-xl h-11">
                  <TabsTrigger value="summary" className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white font-bold transition-all">Summary</TabsTrigger>
                  <TabsTrigger value="questions" className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white font-bold transition-all">Mock Qs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="min-h-[250px] focus-visible:ring-0">
                  {summary ? (
                    <div className="text-sm bg-white/10 p-5 rounded-2xl leading-relaxed whitespace-pre-wrap animate-in fade-in zoom-in duration-500 border border-white/5 shadow-inner">
                      {summary}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
                      <div className="bg-white/10 p-4 rounded-full">
                        <BrainCircuit className="h-12 w-12 opacity-40" />
                      </div>
                      <p className="text-sm text-primary-foreground/60 max-w-[200px] font-medium">Compress these notes into a concise, high-impact summary.</p>
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="rounded-full px-8 font-bold h-12 shadow-lg"
                        onClick={handleGenerateSummary}
                        disabled={isLoadingSummary}
                      >
                        {isLoadingSummary ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        Run Summarizer
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="questions" className="min-h-[250px] focus-visible:ring-0">
                  {questions ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                      {questions.map((q, i) => (
                        <div key={i} className="text-sm bg-white/10 p-4 rounded-2xl flex gap-3 border border-white/5 group/q hover:bg-white/15 transition-colors">
                          <span className="font-black text-accent group-hover/q:scale-110 transition-transform">Q{i+1}</span> 
                          <span className="leading-relaxed">{q}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
                      <div className="bg-white/10 p-4 rounded-full">
                        <MessageSquare className="h-12 w-12 opacity-40" />
                      </div>
                      <p className="text-sm text-primary-foreground/60 max-w-[200px] font-medium">Predict potential examination questions from this text.</p>
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="rounded-full px-8 font-bold h-12 shadow-lg"
                        onClick={handleGenerateQuestions}
                        disabled={isLoadingQuestions}
                      >
                        {isLoadingQuestions ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        Predict Questions
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
