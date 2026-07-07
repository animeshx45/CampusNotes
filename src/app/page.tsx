"use client";

import { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BRANCHES } from '@/lib/mock-data';
import { 
  Search, BookOpen, Users, ArrowRight, GraduationCap, 
  FileText, Download, Code, Cpu, Zap, Hammer, Beaker, Building2, Droplets, Microscope, Globe,
  Sparkles, BrainCircuit, Rocket, Loader2, Bell, Share2, MessageCircle, ShieldCheck, AlertTriangle, Heart
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
      { img: getImg('hero-nitsri-official'), title: 'NIT Srinagar', quote: 'The Ultimate Peer-to-Peer Study Resource Portal.' },
      { img: getImg('it-dept-official'), title: 'IT Dept.', quote: 'Driving Innovation through Advanced Computation and Artificial Intelligence.' },
      { img: getImg('cse-dept-official'), title: 'CSE Dept.', quote: 'Architecting the Future of Intelligent Systems and Global Computation.' },
      { img: getImg('ee-dept-official'), title: 'Electrical Dept.', quote: 'Powering the Future through Engineering Excellence.' },
      { img: getImg('ece-dept-official'), title: 'ECE Dept.', quote: 'Connecting Worlds through Signals and Systems.' },
      { img: getImg('mech-dept-official'), title: 'Mechanical Dept.', quote: 'Designing the Foundations of Modern Machinery.' },
      { img: getImg('civil-dept-official'), title: 'Civil Dept.', quote: 'Constructing a Sustainable World for Tomorrow.' },
      { img: getImg('chem-dept-official'), title: 'Chemical Dept.', quote: 'Transforming Matter for Global Advancement.' },
      { img: getImg('meta-dept-official'), title: 'Metallurgy Dept.', quote: 'Mastering the Science of Materials and Metals.' },
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
    <div className="flex flex-col pb-20 w-full overflow-x-hidden">
      {/* Slideshow Section */}
      <section className="relative min-h-[600px] h-[70vh] md:h-[85vh] md:min-h-[850px] w-full overflow-hidden">
        <Carousel 
          className="w-full h-full"
          plugins={[autoplayPlugin.current]}
          opts={{ loop: true }}
        >
          <CarouselContent className="h-full -ml-0">
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
                  <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center text-center py-20">
                    <div className="max-w-5xl space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                      <div className="inline-flex items-center gap-3 px-4 py-1.5 md:px-6 md:py-2.5 rounded-full bg-white/5 backdrop-blur-3xl text-white text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] border border-white/10 shadow-2xl">
                        <GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-accent" /> {slide.title}
                      </div>
                      <h1 className="text-3xl md:text-7xl lg:text-8xl font-headline font-bold tracking-tighter text-white leading-[1.1] drop-shadow-2xl px-2">
                        {slide.quote}
                      </h1>
                      <p className="text-sm md:text-xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg opacity-80 px-4">
                        The easiest way to find notes, papers, and help for your exams at NIT Srinagar.
                      </p>
                      
                      {/* Search Bar - Liquid Glass Style */}
                      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 px-4">
                        <div className="w-full sm:w-[400px] lg:w-[500px] relative group z-20">
                          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60" />
                          <input 
                            placeholder="Search subjects or papers..." 
                            className="w-full h-14 md:h-16 pl-12 pr-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold placeholder:text-white/40 focus:ring-4 focus:ring-primary/30 transition-all outline-none text-base md:text-lg shadow-2xl shadow-black/40"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/browse?search=${searchQuery}`)}
                          />
                        </div>
                        <Button asChild size="lg" className="rounded-2xl h-14 md:h-16 px-10 font-black text-lg md:text-xl shadow-2xl backdrop-blur-xl bg-primary/90 hover:bg-primary border border-white/10 hover:scale-[1.05] transition-all">
                          <Link href={`/browse?search=${searchQuery}`}>Find Notes</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-24 md:bottom-40 right-4 md:right-16 flex gap-3 md:gap-4 z-30 scale-90 md:scale-100">
            <CarouselPrevious className="relative left-0 translate-y-0 h-12 w-12 md:h-14 md:w-14 bg-white/5 backdrop-blur-3xl hover:bg-primary/50 hover:text-white border border-white/10 rounded-2xl transition-all shadow-2xl" />
            <CarouselNext className="relative right-0 translate-y-0 h-12 w-12 md:h-14 md:w-14 bg-white/5 backdrop-blur-3xl hover:bg-primary/50 hover:text-white border border-white/10 rounded-2xl transition-all shadow-2xl" />
          </div>
        </Carousel>
        
        {/* Ticker */}
        <div className="absolute bottom-0 w-full bg-secondary/80 backdrop-blur-3xl border-t border-white/5 py-3 md:py-4 z-40">
          <div className="container mx-auto px-4 flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2 text-primary font-black uppercase text-[9px] md:text-[11px] tracking-widest shrink-0 border-r border-white/10 pr-4 md:pr-6">
              <Bell className="h-3 w-3 md:h-4 md:w-4" /> <span className="hidden xs:inline">Latest Updates:</span>
            </div>
            <div className="overflow-hidden relative flex-grow h-6 group">
              <div className="absolute whitespace-nowrap animate-marquee group-hover:pause flex gap-8 md:gap-16 text-xs md:text-sm font-bold text-muted-foreground/80">
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

      {/* Stats - Liquid Glass Cards */}
      <section className="container mx-auto px-4 -mt-12 md:-mt-20 relative z-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-3xl p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] flex flex-col gap-3 md:gap-4 border border-white/10 shadow-3xl hover:border-primary/40 hover:bg-white/10 transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                <stat.icon className="h-24 w-24 md:h-32 md:w-32 text-white" />
              </div>
              <div className="h-12 w-12 md:h-14 md:w-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-white/5">
                <stat.icon className="h-6 w-6 md:h-7 md:w-7" />
              </div>
              <div>
                <p className={`text-4xl md:text-5xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
                <p className="text-[9px] md:text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em] mt-1 md:mt-2">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Moving Disclaimer Notice */}
      <div className="bg-accent/10 border-y border-accent/20 py-3 overflow-hidden relative z-40 mt-8 md:mt-12">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-accent font-black uppercase text-[9px] md:text-[10px] tracking-[0.3em] flex items-center gap-8 px-4">
            <AlertTriangle className="h-3 w-3 md:h-3.5 md:w-3.5" />
            NOTICE: THIS IS NOT THE OFFICIAL NIT SRINAGAR WEBSITE AND IS MADE BY STUDENTS OF NIT SRINAGAR.
            <AlertTriangle className="h-3 w-3 md:h-3.5 md:w-3.5" />
            NOTICE: THIS IS NOT THE OFFICIAL NIT SRINAGAR WEBSITE AND IS MADE BY STUDENTS OF NIT SRINAGAR.
            <AlertTriangle className="h-3 w-3 md:h-3.5 md:w-3.5" />
            NOTICE: THIS IS NOT THE OFFICIAL NIT SRINAGAR WEBSITE AND IS MADE BY STUDENTS OF NIT SRINAGAR.
          </span>
        </div>
      </div>

      {/* Branches */}
      <section className="container mx-auto px-4 space-y-10 md:space-y-16 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 md:gap-8 border-b border-white/5 pb-10 md:pb-12">
          <div className="space-y-3 md:space-y-4">
            <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1.5 md:px-5 md:py-1.5 font-black tracking-[0.2em] text-[9px] md:text-[10px]">NOTES LIBRARY</Badge>
            <h2 className="text-3xl md:text-6xl font-headline font-bold tracking-tight text-primary">See Notes by Branch.</h2>
            <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl leading-relaxed">Find study material for all 8 engineering branches at NIT Srinagar.</p>
          </div>
          <Button variant="outline" asChild className="rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest border border-white/10 bg-white/5 backdrop-blur-xl h-12 md:h-14 px-8 md:px-10 hover:bg-primary hover:text-white transition-all w-full md:w-auto">
            <Link href="/browse">See All Notes <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || BookOpen;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="group hover:bg-primary/90 transition-all duration-500 cursor-pointer rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:-translate-y-2 md:hover:-translate-y-4 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(22,163,74,0.3)] h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6 md:p-12 gap-4 md:gap-6 text-center h-full">
                    <div className="p-4 md:p-6 rounded-2xl bg-white/5 group-hover:bg-white/20 transition-all duration-500 shadow-inner group-hover:rotate-12 border border-white/5">
                      <Icon className="h-8 w-8 md:h-10 md:w-10 text-primary group-hover:text-white" />
                    </div>
                    <span className="font-bold text-sm md:text-base tracking-tight leading-tight group-hover:text-white transition-colors">{branch}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Help */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 border border-white/10 relative overflow-hidden group/lab shadow-3xl">
          <div className="absolute -top-12 -right-12 p-12 opacity-5 pointer-events-none group-hover/lab:rotate-45 transition-transform duration-[2000ms]">
             <BrainCircuit className="h-64 w-64 md:h-96 md:w-96 text-primary" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8 md:space-y-10 relative z-10">
              <div className="space-y-3 md:space-y-4">
                <Badge className="bg-accent/80 text-accent-foreground px-4 py-1.5 md:px-6 md:py-2 rounded-full font-black uppercase tracking-widest text-[9px] md:text-[11px] shadow-lg animate-pulse backdrop-blur-xl border border-white/20">
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-2 inline" /> AI Study Assistant
                </Badge>
                <h2 className="text-3xl md:text-7xl font-headline font-bold tracking-tighter text-primary leading-tight">
                  Learn Hard <br /><span className="text-foreground italic">Topics Easily.</span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
                  Stuck on a hard topic? Our AI Study Buddy explains hard engineering concepts in simple words.
                </p>
              </div>
              
              <div className="space-y-4 max-w-xl">
                 <div className="flex flex-col sm:flex-row gap-4">
                   <div className="flex-grow relative group">
                      <Zap className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-primary/40 group-focus-within:text-primary z-10 transition-colors" />
                      <input 
                        placeholder="e.g. Fourier Series" 
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        className="w-full h-14 md:h-18 pl-12 md:pl-14 pr-6 rounded-xl md:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 focus:ring-4 focus:ring-primary/30 outline-none text-base md:text-lg font-bold text-white placeholder:text-white/40 shadow-inner relative z-0 transition-all"
                      />
                   </div>
                   <Button 
                    onClick={handleAiSimplify}
                    disabled={isAiLoading || !aiTopic.trim()}
                    size="lg" 
                    className="rounded-xl md:rounded-2xl h-14 md:h-18 px-10 md:px-12 font-black text-lg md:text-xl bg-primary/90 hover:bg-primary backdrop-blur-xl border border-white/10 hover:scale-[1.05] transition-all gap-2 md:gap-3 shadow-2xl shadow-primary/30"
                   >
                     {isAiLoading ? <Loader2 className="h-6 w-6 md:h-7 md:w-7 animate-spin" /> : <Rocket className="h-6 w-6 md:h-7 md:w-7" />}
                     Simplify
                   </Button>
                 </div>
              </div>
            </div>

            <div className="relative min-h-[350px] md:min-h-[450px] flex items-center justify-center">
              {aiResponse ? (
                <Card className="w-full bg-white/5 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 animate-in zoom-in-95 fade-in slide-in-from-bottom-8 duration-700">
                   <div className="flex items-center gap-3 md:gap-4 text-primary mb-6 md:mb-8 border-b border-white/10 pb-4 md:pb-6">
                      <div className="h-10 w-10 md:h-12 md:w-12 bg-white/5 rounded-xl flex items-center justify-center shadow-inner border border-white/10">
                        <BrainCircuit className="h-6 w-6 md:h-7 md:w-7" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold tracking-tight">AI Insights</h3>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground line-clamp-1">Topic: {aiTopic}</p>
                      </div>
                   </div>
                   <div className="space-y-6 md:space-y-8">
                      <div className="bg-white/5 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 text-base md:text-xl leading-relaxed italic text-foreground font-medium shadow-inner">
                        "{aiResponse.explanation}"
                      </div>
                      <div className="space-y-3 md:space-y-4">
                        <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-2">Key Takeaways</p>
                        <div className="grid grid-cols-1 gap-2 md:gap-3">
                          {aiResponse.keyPoints.map((pt: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 md:gap-4 text-sm md:text-base font-bold bg-white/5 backdrop-blur-xl p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/5 hover:border-primary/40 transition-all group/item">
                              <div className="h-2 w-2 md:h-3 md:w-3 rounded-full bg-accent group-hover/item:scale-125 transition-transform" />
                              {pt}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" className="w-full h-12 md:h-14 rounded-xl md:rounded-2xl text-primary font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-white/10 border border-white/10 mt-2 backdrop-blur-xl" onClick={() => setAiResponse(null)}>
                        New Topic
                      </Button>
                   </div>
                </Card>
              ) : (
                <div className="text-center space-y-8 md:space-y-12 group/placeholder">
                   <div className="h-40 w-40 md:h-56 md:w-56 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto shadow-2xl relative group-hover/lab:scale-105 transition-transform duration-1000 border border-white/10">
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20 animate-[spin_30s_linear_infinite]" />
                      <Sparkles className="h-16 w-16 md:h-24 md:w-24 text-primary animate-pulse" />
                   </div>
                   <div className="space-y-3 md:space-y-4 animate-bounce">
                     <p className="text-2xl md:text-4xl font-headline font-bold text-primary/40 tracking-tight">I'm Ready to Help.</p>
                     <p className="text-sm md:text-lg text-muted-foreground font-medium max-w-[240px] md:max-w-xs mx-auto leading-relaxed">Type any topic above to get a simple explanation.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="container mx-auto px-4 pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 group/cta shadow-3xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(22,163,74,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(45,185,116,0.1),transparent_60%)]" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 p-8 md:p-24 items-center">
            <div className="space-y-8 md:space-y-10 text-center lg:text-left">
              <div className="space-y-4 md:space-y-6">
                <Badge className="bg-primary/10 text-primary border border-white/10 backdrop-blur-xl rounded-full px-4 py-1.5 md:px-5 md:py-2 font-black tracking-widest text-[9px] md:text-[10px]">HELP YOUR FRIENDS</Badge>
                <h2 className="text-4xl md:text-8xl font-headline font-bold tracking-tighter text-white leading-[0.9]">
                  Share and <br />Help <span className="text-primary italic">Others.</span>
                </h2>
                <p className="text-lg md:text-2xl text-muted-foreground font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Join hundreds of students who share notes to help each other succeed in exams.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start">
                <Button asChild size="lg" className="h-16 md:h-20 rounded-xl md:rounded-[1.5rem] px-8 md:px-12 font-black text-lg md:text-xl shadow-2xl bg-primary/90 hover:bg-primary backdrop-blur-xl border border-white/20 transition-all hover:scale-105 group/btn w-full sm:w-auto">
                  <Link href="/upload" className="flex items-center justify-center gap-3">
                    Start Sharing <Share2 className="h-5 w-5 md:h-6 md:w-6 group-hover/btn:rotate-12 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-16 md:h-20 rounded-xl md:rounded-[1.5rem] px-8 md:px-12 font-black text-lg md:text-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all group/btn2 w-full sm:w-auto">
                  <Link href="/forum" className="flex items-center justify-center gap-3">
                    Join Chat <MessageCircle className="h-5 w-5 md:h-6 md:w-6 group-hover/btn2:-translate-y-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* How we help cards */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 relative pt-10 lg:pt-0">
              <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] hover:-translate-y-2 transition-transform duration-500 shadow-xl group/card">
                <div className="h-10 w-10 md:h-12 md:w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3 md:mb-4 group-hover/card:bg-primary group-hover/card:text-white transition-colors border border-white/5">
                  <GraduationCap className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-sm md:text-lg font-bold mb-1 text-white">Study Together</h3>
                <p className="text-[10px] md:text-xs text-muted-foreground font-medium leading-relaxed">Access notes for every branch.</p>
              </Card>
              <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] translate-y-6 md:translate-y-10 hover:translate-y-4 md:hover:translate-y-7 transition-transform duration-500 shadow-xl group/card">
                <div className="h-10 w-10 md:h-12 md:w-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-3 md:mb-4 group-hover/card:bg-accent group-hover/card:text-black transition-colors border border-white/5">
                  <ShieldCheck className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-sm md:text-lg font-bold mb-1 text-white">Top Quality</h3>
                <p className="text-[10px] md:text-xs text-muted-foreground font-medium leading-relaxed">Verified senior notes.</p>
              </Card>
              <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] hover:-translate-y-2 transition-transform duration-500 shadow-xl group/card">
                <div className="h-10 w-10 md:h-12 md:w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3 md:mb-4 group-hover/card:bg-primary group-hover/card:text-white transition-colors border border-white/5">
                  <Users className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-sm md:text-lg font-bold mb-1 text-white">Active Group</h3>
                <p className="text-[10px] md:text-xs text-muted-foreground font-medium leading-relaxed">Growing fast every day.</p>
              </Card>
              <Card className="bg-white/5 backdrop-blur-3xl border border-white/10 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] translate-y-6 md:translate-y-10 hover:translate-y-4 md:hover:translate-y-7 transition-transform duration-500 shadow-xl group/card">
                <div className="h-10 w-10 md:h-12 md:w-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-3 md:mb-4 group-hover/card:bg-accent group-hover/card:text-black transition-colors border border-white/5">
                  <Heart className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <h3 className="text-sm md:text-lg font-bold mb-1 text-white">Student Wisdom</h3>
                <p className="text-[10px] md:text-xs text-muted-foreground font-medium leading-relaxed">Empowering juniors.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
