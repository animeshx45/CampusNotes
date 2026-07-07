"use client";

import { useState, use, useEffect, useMemo } from 'react';
import { StudyMaterial, User } from '@/lib/types';
import { MOCK_MATERIALS } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BrainCircuit, Download, FileText, Share2, MessageSquare, 
  Info, Sparkles, AlertCircle, Loader2, Zap, ArrowLeft, 
  ExternalLink, Youtube, Monitor, Eye, ShieldCheck, Trash2, Edit,
  Terminal, Lightbulb, CheckCircle2, Rocket
} from 'lucide-react';
import { generateStudyMaterialSummary } from '@/ai/flows/generate-study-material-summary';
import { generateExamQuestions } from '@/ai/flows/generate-exam-questions-flow';
import { simplifyConcept } from '@/ai/flows/simplify-concept-flow';
import { useToast } from '@/hooks/use-toast';
import { materialService } from '@/services/material-service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDoc, useFirestore, useMemoFirebase, useUser, useCollection } from '@/firebase';
import { doc, Timestamp, query, collection, where, limit } from 'firebase/firestore';
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
  const { user } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const userProfileQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users'), where('id', '==', user.uid), limit(1));
  }, [db, user]);

  const { data: profiles } = useCollection<User>(userProfileQuery);
  const profile = profiles?.[0];
  const isAdmin = profile?.role === 'admin';

  const mockMaterial = useMemo(() => MOCK_MATERIALS.find(m => m.id === id), [id]);

  const materialRef = useMemoFirebase(() => {
    if (!db || !id || id.startsWith('it-') || id.startsWith('cse-') || id.startsWith('chem-') || id.includes('s3-') || id.includes('s4-') || id.includes('s5-') || id.includes('s6-') || id.includes('s7-') || id.includes('s8-')) return null;
    return doc(db, 'studyMaterials', id);
  }, [db, id]);

  const { data: dbMaterial, isLoading } = useDoc<StudyMaterial>(materialRef);

  const material = mockMaterial || dbMaterial;

  const [summary, setSummary] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [simplified, setSimplified] = useState<any | null>(null);
  
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [isLoadingSimplified, setIsLoadingSimplified] = useState(false);

  useEffect(() => {
    if (material) {
      materialService.incrementViewCount(id);
    }
  }, [material, id]);

  if (isLoading && !mockMaterial) return <ModernLoader message="Opening your study materials..." />;

  if (!material) {
    return (
      <div className="container mx-auto py-20 text-center space-y-6">
        <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-headline font-bold text-primary">Notes Not Found</h1>
          <p className="text-muted-foreground">The notes you are looking for are not here. Please check the library again.</p>
        </div>
        <Button asChild className="rounded-full px-8 h-12">
          <Link href="/browse"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Library</Link>
        </Button>
      </div>
    );
  }

  const handleDownload = () => {
    if (!material.fileUrl) {
        toast({ title: "No Link", description: "This resource doesn't have a download link yet." });
        return;
    }
    materialService.incrementDownloadCount(id);
    window.open(material.fileUrl, '_blank');
  };

  const handleAdminDelete = () => {
    if (confirm("Management Decision: Delete this resource permanently?")) {
      materialService.deleteMaterial(id);
      toast({ title: "Material Removed", description: "This resource has been deleted by an administrator." });
      router.push('/admin');
    }
  };

  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    try {
      const result = await generateStudyMaterialSummary({ 
        studyMaterialContent: `${material.title}. ${material.description}` 
      });
      setSummary(result.summary);
    } catch (error) {
      toast({ title: "Error making summary", description: "Try again in a bit.", variant: "destructive" });
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
      toast({ title: "Error making questions", description: "Try again in a bit.", variant: "destructive" });
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const handleSimplifyConcept = async () => {
    setIsLoadingSimplified(true);
    try {
      const result = await simplifyConcept({ 
        concept: material.title,
        branch: material.branch 
      });
      setSimplified(result);
    } catch (error) {
      toast({ title: "Error simplifying", description: "Try again in a bit.", variant: "destructive" });
    } finally {
      setIsLoadingSimplified(false);
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
  const hasFile = !!material.fileUrl;
  const isImage = hasFile && (material.fileUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i) || material.fileUrl?.includes('picsum.photos') || material.fileUrl?.includes('placehold.co'));
  
  const previewUrl = hasFile ? (material.fileUrl.includes('docs.google.com') 
    ? material.fileUrl 
    : `https://docs.google.com/viewer?url=${encodeURIComponent(material.fileUrl)}&embedded=true`) : null;

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {isAdmin && (
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 text-primary font-bold text-sm">
            <ShieldCheck className="h-5 w-5" /> Manager Actions Enabled
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-xl border-primary/20 h-9" asChild>
              <Link href="/admin"><Edit className="h-4 w-4 mr-2" /> Modify</Link>
            </Button>
            <Button variant="destructive" size="sm" className="rounded-xl h-9" onClick={handleAdminDelete}>
              <Trash2 className="h-4 w-4 mr-2" /> Delete Permanently
            </Button>
          </div>
        </div>
      )}

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
            <div className="flex items-center gap-1.5"><Eye className="h-4 w-4" /> {material.views || 0} views</div>
          </div>
        </div>
        <div className="flex gap-3 shrink-0 w-full md:w-auto">
          <Button variant="outline" size="icon" className="rounded-full border-primary/20 hover:bg-primary/5 h-12 w-12" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({ title: "Link Copied!", description: "Share it with your friends." });
          }}><Share2 className="h-5 w-5" /></Button>
          <Button size="lg" className="rounded-full px-8 h-12 shadow-lg shadow-primary/20 flex-1 md:flex-none font-bold text-base" onClick={handleDownload} disabled={!hasFile}>
            {isYoutube ? <ExternalLink className="mr-2 h-5 w-5" /> : <Download className="mr-2 h-5 w-5" />}
            {isYoutube ? 'Open Link' : 'Download Now'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl bg-card rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="font-headline font-bold text-primary flex items-center gap-2">
                <FileText className="h-5 w-5" /> About These Notes
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
                <p className="font-medium">Please verify these materials with the official syllabus at nitsri.ac.in before exams.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-headline font-bold text-primary">
                  {isYoutube ? 'Study Link' : 'Study Materials'}
                </CardTitle>
                <CardDescription>
                  {isYoutube ? 'Click below to watch the playlist.' : 'Read and study directly from the browser.'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {!hasFile ? (
                <div className="aspect-video bg-secondary/20 rounded-[1.5rem] flex flex-col items-center justify-center border-2 border-dashed border-primary/20 p-10 text-center gap-4">
                  <Monitor className="h-12 w-12 text-primary/40" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">No Preview Available</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">We haven't added a link for this subject yet. Check back soon!</p>
                  </div>
                </div>
              ) : isYoutube ? (
                <div className="aspect-video bg-black rounded-[1.5rem] flex items-center justify-center overflow-hidden border border-primary/20 shadow-2xl relative group">
                   <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-50" />
                   <div className="text-center space-y-4 z-10">
                      <div className="h-20 w-20 bg-red-600 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                        <Youtube className="h-10 w-10 text-white" />
                      </div>
                      <p className="text-white font-headline font-bold text-xl">YouTube Study Hub</p>
                      <Button variant="secondary" className="rounded-full font-bold" asChild>
                        <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">Open Course Material <ExternalLink className="ml-2 h-4 w-4" /></a>
                      </Button>
                   </div>
                </div>
              ) : (
                <div className="aspect-[16/10] bg-muted/10 rounded-[1.5rem] flex flex-col items-center justify-center border-2 border-primary/10 transition-all overflow-hidden relative group">
                  {isImage ? (
                    <div className="w-full h-full relative p-2">
                      <Image 
                        src={material.fileUrl} 
                        alt="Study Material Preview" 
                        fill 
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <iframe 
                        src={previewUrl!}
                        className="w-full h-full border-none bg-white rounded-[1.2rem]"
                        title="Document Preview"
                        onError={() => toast({ title: "Preview Error", description: "Use the button below to open the file." })}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity p-6 text-center z-20 pointer-events-none group-hover:pointer-events-auto">
                        <Monitor className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">Can't see the document?</h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-xs">Some security settings might block previews. You can open it in a new window instead.</p>
                        <Button className="rounded-xl font-bold px-8 h-12" onClick={handleDownload}>
                          Open in Full Tab <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
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
                AI Redefined Assistant
              </CardTitle>
              <CardDescription className="text-primary-foreground/70 font-medium">
                Advanced tools for deep academic insight.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 relative z-10">
              <Tabs defaultValue="simplify" className="w-full">
                <TabsList className="w-full grid grid-cols-3 bg-primary-foreground/10 mb-0 border-none p-1 rounded-none h-14">
                  <TabsTrigger value="simplify" className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white font-bold transition-all text-xs">Explain</TabsTrigger>
                  <TabsTrigger value="summary" className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white font-bold transition-all text-xs">Summary</TabsTrigger>
                  <TabsTrigger value="practice" className="rounded-lg data-[state=active]:bg-accent data-[state=active]:text-white font-bold transition-all text-xs">Practice</TabsTrigger>
                </TabsList>
                
                <TabsContent value="simplify" className="p-6 min-h-[300px] focus-visible:ring-0">
                  {simplified ? (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                       <div className="bg-white/10 p-5 rounded-2xl border border-white/5 shadow-inner">
                          <div className="flex items-center gap-2 text-accent mb-3">
                             <Lightbulb className="h-5 w-5" />
                             <span className="font-black uppercase tracking-widest text-[10px]">Simple Analogy</span>
                          </div>
                          <p className="text-sm leading-relaxed italic">{simplified.explanation}</p>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Key Intuitions</p>
                          {simplified.keyPoints.map((pt: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 text-xs font-bold bg-white/5 p-3 rounded-xl">
                              <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                              {pt}
                            </div>
                          ))}
                       </div>
                       <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase" onClick={() => setSimplified(null)}>Reset Assistant</Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
                      <div className="bg-white/10 p-5 rounded-full">
                        <Zap className="h-10 w-10 text-accent animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold">Concept Simplifier</p>
                        <p className="text-xs text-primary-foreground/60 max-w-[200px]">Get a student-friendly explanation of "{material.title}".</p>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="rounded-full px-10 font-bold h-12 shadow-xl"
                        onClick={handleSimplifyConcept}
                        disabled={isLoadingSimplified}
                      >
                        {isLoadingSimplified ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        Explain Simply
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="summary" className="p-6 min-h-[300px] focus-visible:ring-0">
                  {summary ? (
                    <div className="text-sm bg-white/10 p-5 rounded-2xl leading-relaxed whitespace-pre-wrap animate-in fade-in zoom-in duration-500 border border-white/5 shadow-inner">
                      <div className="flex items-center gap-2 text-accent mb-4">
                         <FileText className="h-5 w-5" />
                         <span className="font-black uppercase tracking-widest text-[10px]">Structured Summary</span>
                      </div>
                      {summary}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
                      <div className="bg-white/10 p-5 rounded-full">
                        <BrainCircuit className="h-10 w-10 opacity-40" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold">Smart Digest</p>
                        <p className="text-xs text-primary-foreground/60 max-w-[200px]">Extract key points and a structured summary from these notes.</p>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="rounded-full px-10 font-bold h-12 shadow-xl"
                        onClick={handleGenerateSummary}
                        disabled={isLoadingSummary}
                      >
                        {isLoadingSummary ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        Generate Digest
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="practice" className="p-6 min-h-[300px] focus-visible:ring-0">
                  {questions ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
                      <div className="flex items-center gap-2 text-accent mb-4">
                         <Terminal className="h-5 w-5" />
                         <span className="font-black uppercase tracking-widest text-[10px]">Practice Lab</span>
                      </div>
                      {questions.map((q, i) => (
                        <div key={i} className="text-sm bg-white/10 p-4 rounded-2xl flex gap-3 border border-white/5 group/q hover:bg-white/15 transition-colors">
                          <span className="font-black text-accent group-hover/q:scale-110 transition-transform">Q{i+1}</span> 
                          <span className="leading-relaxed font-medium">{q}</span>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" className="w-full text-[10px] font-black uppercase" onClick={() => setQuestions(null)}>New Practice Set</Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
                      <div className="bg-white/10 p-5 rounded-full">
                        <MessageSquare className="h-10 w-10 opacity-40" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold">Exam Simulator</p>
                        <p className="text-xs text-primary-foreground/60 max-w-[200px]">Turn this material into a set of challenging practice questions.</p>
                      </div>
                      <Button 
                        variant="secondary" 
                        size="lg" 
                        className="rounded-full px-10 font-bold h-12 shadow-xl"
                        onClick={handleGenerateQuestions}
                        disabled={isLoadingQuestions}
                      >
                        {isLoadingQuestions ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
                        Create Test
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
