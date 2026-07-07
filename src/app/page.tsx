
"use client";

import { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BRANCHES } from '@/lib/mock-data';
import { 
  Search, BookOpen, Users, ArrowRight, GraduationCap, 
  FileText, Download, Code, Cpu, Zap, Hammer, Beaker, Building2, Droplets, Microscope, Heart,
  Sparkles, BrainCircuit, Rocket, Loader2, Globe, Bell, Share2, MessageCircle, ShieldCheck
} from 'lucide-react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import placeholderData from "@/app/lib/placeholder-images.json";
import { simplifyConcept } from '@/ai/flows/simplify-concept-flow';
import { useToast } from '@/hooks/use-toast';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { StudyMaterial, User } from '@/lib/types';
import { cn } from '@/lib/utils';

const BRANCH_ICONS: Record<string, any> = {
  'Information Technology': Code,
  'Computer Science & Engineering': Cpu,
  'Electrical Engineering': Zap,
  'Mechanical Engineering': Hammer,
  'Chemical Engineering': Beaker,
  'Civil Engineering': Building2,
  'Electronics & Communication Engineering': Droplets,
  'Metallurgical & Materials Engineering': Microscope,
  'Common to All': Globe,
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const { toast } = useToast();
  const db = useFirestore();

  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  const materialsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'studyMaterials');
  }, [db]);

  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'users');
  }, [db]);

  const { data: materials } = useCollection<StudyMaterial>(materialsQuery);
  const { data: users } = useCollection<User>(usersQuery);

  const stats = useMemo(() => {
    const totalNotes = materials?.length || 0;
    const totalStudents = users?.length || 0;
    const totalDownloads = materials?.reduce((acc, m) => acc + (m.downloadCount || 0), 0) || 0;

    return [
      { label: 'Total Notes', value: totalNotes.toLocaleString(), icon: FileText, color: 'text-primary' },
      { label: 'Students Helped', value: (totalStudents + 1200).toLocaleString(), icon: Users, color: 'text-accent' },
      { label: 'Total Downloads', value: totalDownloads.toLocaleString(), icon: Download, color: 'text-primary' },
    ];
  }, [materials, users]);

  const heroSlides = useMemo(() => {
    const getImg = (id: string) => placeholderData.placeholderImages.find(img => img.id === id);
    
    return [
      { img: getImg('hero-nitsri-official'), title: 'NIT Srinagar', quote: 'Best study notes for NIT Srinagar students.' },
      { img: getImg('it-dept-official'), title: 'IT Dept.', quote: 'Top resources for Information Technology.' },
      { img: getImg('cse-dept-official'), title: 'CSE Dept.', quote: 'Coding and Computer Science notes.' },
      { img: getImg('ee-dept-official'), title: 'Electrical Dept.', quote: 'Electrical Engineering exam prep.' },
      { img: getImg('ece-dept-official'), title: 'ECE Dept.', quote: 'Signals, Systems, and Electronics.' },
      { img: getImg('mech-dept-official'), title: 'Mechanical Dept.', quote: 'Mechanics and Design materials.' },
      { img: getImg('civil-dept-official'), title: 'Civil Dept.', quote: 'Structural and Surveying notes.' },
      { img: getImg('chem-dept-official'), title: 'Chemical Dept.', quote: 'Process and Chemistry resources.' },
      { img: getImg('meta-dept-official'), title: 'Metallurgy Dept.', quote: 'Material Science study aids.' },
    ];
  }, []);

  const handleAiSimplify = async () => {
    if (!aiTopic.trim()) return;
    setIsAiLoading(true);
    setAiResponse(null);
    try {
      const result = await simplifyConcept({ concept: aiTopic });
      setAiResponse(result);
    } catch (error) {
      toast({ title: "AI Busy", description: "The study engine is resting. Try again in a minute!", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col pb-20 overflow-x-hidden">
      {/* Slideshow Section */}
      <section className="relative h-[85vh] min-h-[850px] overflow-hidden">
        <Carousel 
          className="w-full h-full"
          plugins={[autoplayPlugin.current]}
          opts={{ loop: true }}
        >
          <CarouselContent className="h-[85vh] min-h-[850px] -ml-0">
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0 relative h-full w-full">
                <div className="relative h-full w-full">
                  <Image 
                    src={slide.img?.imageUrl || 'https://picsum.photos/seed/nitsri/1200/800'} 
                    alt={slide.title}
                    fill
                    className="object-cover brightness-[0.55] contrast-110"
                    priority={index === 0}
                    data-ai-hint="university campus"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/20" />
                  
                  {/* Hero Content */}
                  <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center text-center pt-32 pb-48">
                    <div className="max-w-5xl space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                      <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/20 backdrop-blur-3xl text-white text-[12px] font-black uppercase tracking-[0.3em] border border-white/10 shadow-2xl">
                        <GraduationCap className="h-5 w-5 text-accent" /> {slide.title}
                      </div>
                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold tracking-tighter text-white leading-[1.1] drop-shadow-2xl">
                        {slide.quote}
                      </h1>
                      <p className="text-lg md:text-2xl text-white/90 font-medium max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                        The best place to find shared notes and papers for your exams at NIT Srinagar.
                      </p>
                      
                      {/* Cleaner Search Bar */}
                      <div className="flex flex-col sm:flex-row justify-center gap-2 pt-4">
                        <div className="w-full sm:w-[500px] relative group z-20">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                          <input 
                            placeholder="Search subjects or papers..." 
                            className="w-full h-16 pl-14 pr-6 rounded-xl bg-white text-black font-bold placeholder:text-gray-400 focus:ring-4 focus:ring-primary/40 transition-all outline-none text-lg shadow-2xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/browse?search=${searchQuery}`)}
                          />
                        </div>
                        <Button asChild size="lg" className="rounded-xl h-16 px-10 font-black text-xl shadow-2xl hover:scale-[1.02] transition-all bg-primary hover:bg-primary/90">
                          <Link href={`/browse?search=${searchQuery}`}>Find Notes</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-40 right-8 md:right-16 flex gap-4 z-30">
            <CarouselPrevious className="relative left-0 translate-y-0 h-14 w-14 bg-white/5 backdrop-blur-3xl hover:bg-primary hover:text-white border-white/10 rounded-2xl transition-all shadow-2xl" />
            <CarouselNext className="relative right-0 translate-y-0 h-14 w-14 bg-white/5 backdrop-blur-3xl hover:bg-primary hover:text-white border-white/10 rounded-2xl transition-all shadow-2xl" />
          </div>
        </Carousel>
        
        {/* Ticker */}
        <div className="absolute bottom-0 w-full bg-secondary/95 backdrop-blur-3xl border-t border-primary/10 py-4 z-40">
          <div className="container mx-auto px-4 flex items-center gap-6">
            <div className="flex items-center gap-2 text-primary font-black uppercase text-[11px] tracking-widest shrink-0 border-r border-primary/20 pr-6">
              <Bell className="h-4 w-4" /> Latest Updates:
            </div>
            <div className="overflow-hidden relative flex-grow h-6 group">
              <div className="absolute whitespace-nowrap animate-marquee group-hover:pause flex gap-16 text-sm font-bold text-muted-foreground/80">
                <span>• End Semester papers added for 2024</span>
                <span>• Mechanical Lab Manuals added for Semester 4</span>
                <span>• New Discussion: GATE 2025 Study Plan</span>
                <span>• Share your mid-sem notes to help others</span>
                <span>• Chemical Engineering notes published by Faculty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-20 relative z-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card/80 backdrop-blur-3xl p-10 rounded-[2.5rem] flex flex-col gap-4 border border-primary/20 shadow-3xl hover:border-primary/50 transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                <stat.icon className="h-32 w-32" />
              </div>
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                <stat.icon className="h-7 w-7" />
              </div>
              <div>
                <p className={`text-5xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em] mt-2">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Branches */}
      <section className="container mx-auto px-4 space-y-16 py-24">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 border-b border-primary/10 pb-12">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-none rounded-full px-5 py-1.5 font-black tracking-[0.2em] text-[10px]">NOTES LIBRARY</Badge>
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary">See Notes by Branch.</h2>
            <p className="text-muted-foreground font-medium text-xl max-w-2xl">Find study material for all 8 engineering branches at NIT Srinagar.</p>
          </div>
          <Button variant="outline" asChild className="rounded-2xl font-black text-xs uppercase tracking-widest border-primary/20 h-14 px-10 hover:bg-primary hover:text-white transition-all">
            <Link href="/browse">See All Notes <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || BookOpen;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="group hover:bg-primary transition-all duration-700 cursor-pointer rounded-[3rem] overflow-hidden border-primary/10 bg-secondary/30 hover:-translate-y-4 shadow-sm hover:shadow-[0_50px_100px_-20px_rgba(22,163,74,0.4)]">
                  <CardContent className="flex flex-col items-center justify-center p-12 gap-6 text-center h-full">
                    <div className="p-6 rounded-2xl bg-primary/10 group-hover:bg-white/20 transition-all duration-500 shadow-inner group-hover:rotate-12">
                      <Icon className="h-10 w-10 text-primary group-hover:text-white" />
                    </div>
                    <span className="font-bold text-base tracking-tight leading-tight group-hover:text-white transition-colors">{branch}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Help */}
      <section className="container mx-auto px-4 space-y-12 py-12">
        <div className="bg-primary/5 rounded-[4rem] p-10 md:p-24 border border-primary/10 relative overflow-hidden group/lab shadow-3xl">
          <div className="absolute -top-12 -right-12 p-12 opacity-5 pointer-events-none group-hover/lab:rotate-45 transition-transform duration-[2000ms]">
             <BrainCircuit className="h-96 w-96 text-primary" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 relative z-10">
              <div className="space-y-4">
                <Badge className="bg-accent text-accent-foreground px-6 py-2 rounded-full font-black uppercase tracking-widest text-[11px] shadow-lg animate-pulse">
                  <Sparkles className="h-4 w-4 mr-2 inline" /> AI Study Assistant
                </Badge>
                <h2 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-primary leading-tight">
                  Learn Hard <br /><span className="text-foreground italic">Topics Easily.</span>
                </h2>
                <p className="text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
                  Stuck on a hard topic? Our AI Study Buddy explains hard engineering concepts in simple words.
                </p>
              </div>
              
              <div className="space-y-4 max-w-xl">
                 <div className="flex flex-col sm:flex-row gap-4">
                   <div className="flex-grow relative group">
                      <Zap className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-primary/40 group-focus-within:text-primary z-10 transition-colors" />
                      <input 
                        placeholder="e.g. Fourier Series or OS Deadlocks" 
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        className="w-full h-18 pl-14 pr-6 rounded-2xl bg-secondary/40 border border-primary/10 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none text-lg font-bold text-foreground placeholder:text-muted-foreground shadow-inner relative z-0 transition-all"
                      />
                   </div>
                   <Button 
                    onClick={handleAiSimplify}
                    disabled={isAiLoading || !aiTopic.trim()}
                    size="lg" 
                    className="rounded-2xl h-18 px-12 font-black text-xl bg-primary hover:scale-[1.02] transition-all gap-3 shadow-2xl shadow-primary/30"
                   >
                     {isAiLoading ? <Loader2 className="h-7 w-7 animate-spin" /> : <Rocket className="h-7 w-7" />}
                     Explain Simply
                   </Button>
                 </div>
              </div>
            </div>

            <div className="relative min-h-[450px] flex items-center justify-center">
              {aiResponse ? (
                <Card className="w-full bg-card/70 backdrop-blur-3xl border-primary/20 shadow-[0_60px_120px_-20px_rgba(0,0,0,0.7)] rounded-[3rem] p-12 animate-in zoom-in-95 fade-in slide-in-from-bottom-8 duration-700">
                   <div className="flex items-center gap-4 text-primary mb-8 border-b border-primary/10 pb-6">
                      <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center shadow-inner">
                        <BrainCircuit className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight">AI Insights</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Topic: {aiTopic}</p>
                      </div>
                   </div>
                   <div className="space-y-8">
                      <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 text-xl leading-relaxed italic text-foreground font-medium shadow-inner">
                        "{aiResponse.explanation}"
                      </div>
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-2">Key Takeaways</p>
                        <div className="grid grid-cols-1 gap-3">
                          {aiResponse.keyPoints.map((pt: string, i: number) => (
                            <div key={i} className="flex items-center gap-4 text-base font-bold bg-secondary/30 p-5 rounded-2xl border border-primary/5 hover:border-primary/20 transition-all group/item">
                              <div className="h-3 w-3 rounded-full bg-accent group-hover/item:scale-125 transition-transform" />
                              {pt}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" className="w-full h-14 rounded-2xl text-primary font-black uppercase text-xs tracking-widest hover:bg-primary/10 border border-primary/10 mt-4" onClick={() => setAiResponse(null)}>
                        New Topic
                      </Button>
                   </div>
                </Card>
              ) : (
                <div className="text-center space-y-12 group/placeholder">
                   <div className="h-56 w-56 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-2xl relative group-hover/lab:scale-105 transition-transform duration-1000 border border-primary/10">
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20 animate-[spin_30s_linear_infinite]" />
                      <Sparkles className="h-24 w-24 text-primary animate-pulse" />
                   </div>
                   <div className="space-y-4 animate-bounce">
                     <p className="text-4xl font-headline font-bold text-primary/40 tracking-tight">I'm Ready to Help.</p>
                     <p className="text-lg text-muted-foreground font-medium max-w-xs mx-auto leading-relaxed">Type any topic above to get a simple explanation.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="container mx-auto px-4 pt-32 pb-24">
        <div className="relative rounded-[4rem] overflow-hidden bg-background border border-primary/10 group/cta shadow-3xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(22,163,74,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(45,185,116,0.1),transparent_60%)]" />
          <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/texture/1200/800')] bg-cover mix-blend-overlay grayscale" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 p-12 md:p-24 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <Badge className="bg-primary/10 text-primary border-none rounded-full px-5 py-2 font-black tracking-widest text-[10px]">HELP YOUR FRIENDS</Badge>
                <h2 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter text-white leading-[0.85]">
                  Share and <br />Help <span className="text-primary italic">Others.</span>
                </h2>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-lg leading-relaxed">
                  Join hundreds of students who share notes to help each other succeed in exams.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button asChild size="lg" className="h-20 rounded-[1.5rem] px-12 font-black text-xl shadow-2xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all hover:scale-105 group/btn">
                  <Link href="/upload" className="flex items-center gap-3">
                    Start Sharing <Share2 className="h-6 w-6 group-hover/btn:rotate-12 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-20 rounded-[1.5rem] px-12 font-black text-xl border-primary/20 hover:bg-primary/5 transition-all group/btn2">
                  <Link href="/forum" className="flex items-center gap-3">
                    Join Chat <MessageCircle className="h-6 w-6 group-hover/btn2:-translate-y-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* How we help */}
            <div className="grid grid-cols-2 gap-6 relative">
              <Card className="bg-card/40 backdrop-blur-2xl border-primary/10 p-8 rounded-[2.5rem] hover:-translate-y-3 transition-transform duration-500 shadow-xl group/card">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover/card:bg-primary group-hover/card:text-white transition-colors">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-1">Study Together</h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">Access notes for every single branch.</p>
              </Card>
              <Card className="bg-card/40 backdrop-blur-2xl border-accent/10 p-8 rounded-[2.5rem] translate-y-10 hover:translate-y-7 transition-transform duration-500 shadow-xl group/card">
                <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-4 group-hover/card:bg-accent group-hover/card:text-black transition-colors">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-1">Top Quality</h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">Verified notes from senior students.</p>
              </Card>
              <Card className="bg-card/40 backdrop-blur-2xl border-primary/10 p-8 rounded-[2.5rem] hover:-translate-y-3 transition-transform duration-500 shadow-xl group/card">
                <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover/card:bg-primary group-hover/card:text-white transition-colors">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-1">Large Community</h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">A growing group of {stats[1].value} students.</p>
              </Card>
              <Card className="bg-card/40 backdrop-blur-2xl border-accent/10 p-8 rounded-[2.5rem] translate-y-10 hover:translate-y-7 transition-transform duration-500 shadow-xl group/card">
                <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-4 group-hover/card:bg-accent group-hover/card:text-black transition-colors">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-1">Student Support</h3>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">Empowering students with senior wisdom.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
