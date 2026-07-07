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
  Sparkles, BrainCircuit, Rocket, Loader2, Globe, Bell
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
      { label: 'Active Students', value: (totalStudents + 1200).toLocaleString(), icon: Users, color: 'text-accent' },
      { label: 'Impact / Downloads', value: totalDownloads.toLocaleString(), icon: Download, color: 'text-primary' },
    ];
  }, [materials, users]);

  const heroSlides = useMemo(() => {
    const getImg = (id: string) => placeholderData.placeholderImages.find(img => img.id === id);
    
    return [
      { img: getImg('hero-nitsri-official'), title: 'NIT Srinagar', quote: 'Academic Excellence in the Heart of the Valley.' },
      { img: getImg('it-dept-official'), title: 'Dept. of IT', quote: 'Leading Digital Transformation and Innovation.' },
      { img: getImg('cse-dept-official'), title: 'Dept. of CSE', quote: 'Engineering the Computational Future.' },
      { img: getImg('ee-dept-official'), title: 'Dept. of Electrical', quote: 'Powering Progress with Sustainable Energy.' },
      { img: getImg('ece-dept-official'), title: 'Dept. of ECE', quote: 'Connecting Worlds through Signal & Systems.' },
      { img: getImg('mech-dept-official'), title: 'Dept. of Mechanical', quote: 'Designing the Mechanics of the Future.' },
      { img: getImg('civil-dept-official'), title: 'Dept. of Civil', quote: 'Building Sustainable Foundations for Tomorrow.' },
      { img: getImg('chem-dept-official'), title: 'Dept. of Chemical', quote: 'Optimizing Processes, Sustaining Life.' },
      { img: getImg('meta-dept-official'), title: 'Dept. of Metallurgy', quote: 'The Science of Materials and Structures.' },
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
    <div className="flex flex-col pb-20">
      {/* Immersive Slideshow Section */}
      <section className="relative h-[90vh] min-h-[750px] overflow-hidden">
        <Carousel 
          className="w-full h-full"
          plugins={[autoplayPlugin.current]}
          opts={{ loop: true }}
        >
          <CarouselContent className="h-[90vh] -ml-0">
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0 relative h-full w-full">
                <div className="relative h-full w-full">
                  <Image 
                    src={slide.img?.imageUrl || 'https://picsum.photos/seed/nitsri/1200/800'} 
                    alt={slide.title}
                    fill
                    className="object-cover brightness-[0.7] contrast-125 transition-transform duration-[10000ms] hover:scale-105"
                    priority={index === 0}
                    data-ai-hint="university campus"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
                  
                  {/* Hero Content - Increased pb-48 for better separation */}
                  <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center items-center text-center pb-48">
                    <div className="max-w-4xl space-y-8 animate-in fade-in zoom-in duration-1000">
                      <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/20 backdrop-blur-3xl text-white text-[11px] font-black uppercase tracking-[0.3em] border border-white/20 shadow-2xl">
                        <GraduationCap className="h-5 w-5 text-accent" /> {slide.title}
                      </div>
                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold tracking-tighter text-white leading-tight drop-shadow-2xl">
                        {slide.quote}
                      </h1>
                      <p className="text-lg md:text-2xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
                        The definitive repository for student-shared resources and academic discussions at NIT Srinagar.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-10">
                        <div className="w-full sm:w-[450px] relative group">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-white/40 group-focus-within:text-primary transition-colors" />
                          <input 
                            placeholder="Find subjects, topics or PYPs..." 
                            className="w-full h-16 pl-16 pr-6 rounded-2xl bg-white/10 backdrop-blur-3xl border border-white/20 text-white font-bold placeholder:text-white/40 focus:ring-2 focus:ring-primary/40 focus:bg-white/20 transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/browse?search=${searchQuery}`)}
                          />
                        </div>
                        <Button asChild size="lg" className="rounded-2xl h-16 px-10 font-black text-xl shadow-2xl shadow-primary/40 hover:scale-105 transition-transform bg-primary hover:bg-primary/90">
                          <Link href={`/browse?search=${searchQuery}`}>Search Notes</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-32 right-8 md:right-16 flex gap-4 z-20">
            <CarouselPrevious className="relative left-0 translate-y-0 h-14 w-14 bg-white/5 backdrop-blur-3xl hover:bg-primary hover:text-white border-white/10 rounded-2xl transition-all shadow-2xl" />
            <CarouselNext className="relative right-0 translate-y-0 h-14 w-14 bg-white/5 backdrop-blur-3xl hover:bg-primary hover:text-white border-white/10 rounded-2xl transition-all shadow-2xl" />
          </div>
        </Carousel>
        
        {/* Announcement Ticker */}
        <div className="absolute bottom-0 w-full bg-secondary/80 backdrop-blur-3xl border-t border-primary/10 py-3 z-30">
          <div className="container mx-auto px-4 flex items-center gap-6">
            <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest shrink-0">
              <Bell className="h-4 w-4" /> Campus Live:
            </div>
            <div className="overflow-hidden relative flex-grow h-5 group">
              <div className="absolute whitespace-nowrap animate-marquee group-hover:pause flex gap-12 text-xs font-bold text-muted-foreground">
                <span>• End Semester PYPs for all branches have been updated for 2024</span>
                <span>• Mechanical Lab Manuals added for Semester 4</span>
                <span>• New Discussion Thread: GATE 2025 Preparation Strategy</span>
                <span>• Contribution Drive: Share your mid-sem notes to earn badges</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Stats Overlay */}
      <section className="container mx-auto px-4 -mt-20 relative z-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-card/60 backdrop-blur-3xl p-10 rounded-[2.5rem] flex flex-col gap-4 border border-primary/10 shadow-3xl hover:border-primary/40 transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-700">
                <stat.icon className="h-32 w-32" />
              </div>
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                <stat.icon className="h-7 w-7" />
              </div>
              <div>
                <p className={`text-4xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Department Quick Pick */}
      <section className="container mx-auto px-4 space-y-12 py-24">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 border-b border-primary/10 pb-12">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-none rounded-full px-5 py-1.5 font-black tracking-[0.2em] text-[10px]">RESOURCES DIRECTORY</Badge>
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary">Academic Vaults.</h2>
            <p className="text-muted-foreground font-medium text-xl max-w-2xl">Precision-curated study material for the 8 core engineering disciplines at NIT Srinagar.</p>
          </div>
          <Button variant="outline" asChild className="rounded-2xl font-black text-xs uppercase tracking-widest border-primary/20 h-14 px-10 hover:bg-primary hover:text-white transition-all">
            <Link href="/browse">Enter Library <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || BookOpen;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="group hover:bg-primary transition-all duration-700 cursor-pointer rounded-[2.5rem] overflow-hidden border-primary/5 bg-secondary/20 hover:-translate-y-3 shadow-sm hover:shadow-[0_40px_80px_-15px_rgba(22,163,74,0.3)]">
                  <CardContent className="flex flex-col items-center justify-center p-10 gap-6 text-center h-full">
                    <div className="p-5 rounded-2xl bg-primary/10 group-hover:bg-white/20 transition-all duration-500 shadow-inner group-hover:rotate-12">
                      <Icon className="h-10 w-10 text-primary group-hover:text-white" />
                    </div>
                    <span className="font-bold text-sm tracking-tight leading-tight group-hover:text-white transition-colors">{branch}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Study Engine */}
      <section className="container mx-auto px-4 space-y-12 py-12">
        <div className="bg-primary/5 rounded-[4rem] p-10 md:p-24 border border-primary/10 relative overflow-hidden group/lab shadow-3xl">
          <div className="absolute -top-12 -right-12 p-12 opacity-5 pointer-events-none group-hover/lab:rotate-45 transition-transform duration-[2000ms]">
             <BrainCircuit className="h-96 w-96 text-primary" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 relative z-10">
              <div className="space-y-4">
                <Badge className="bg-accent text-accent-foreground px-6 py-2 rounded-full font-black uppercase tracking-widest text-[11px] shadow-lg animate-pulse">
                  <Sparkles className="h-4 w-4 mr-2 inline" /> Genkit-Powered Intelligence
                </Badge>
                <h2 className="text-5xl md:text-7xl font-headline font-bold tracking-tighter text-primary leading-tight">
                  Master Hard <br /><span className="text-foreground italic">Concepts.</span>
                </h2>
                <p className="text-xl text-muted-foreground font-medium max-w-lg leading-relaxed">
                  Bridge the gap between lectures and labs. Our AI Study Engine simplifies complex engineering syllabus instantly.
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
                    className="rounded-2xl h-18 px-12 font-black text-xl bg-primary hover:scale-105 transition-all gap-3 shadow-2xl shadow-primary/30"
                   >
                     {isAiLoading ? <Loader2 className="h-7 w-7 animate-spin" /> : <Rocket className="h-7 w-7" />}
                     Simplify
                   </Button>
                 </div>
              </div>
            </div>

            <div className="relative min-h-[400px] flex items-center justify-center">
              {aiResponse ? (
                <Card className="w-full bg-card/60 backdrop-blur-3xl border-primary/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] rounded-[3rem] p-12 animate-in zoom-in-95 fade-in slide-in-from-bottom-8 duration-700">
                   <div className="flex items-center gap-4 text-primary mb-8 border-b border-primary/10 pb-6">
                      <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center shadow-inner">
                        <BrainCircuit className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight">AI Insights</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subject: {aiTopic}</p>
                      </div>
                   </div>
                   <div className="space-y-8">
                      <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10 text-xl leading-relaxed italic text-foreground font-medium shadow-inner">
                        "{aiResponse.explanation}"
                      </div>
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-2">Engine Output / Key Takeaways</p>
                        <div className="grid grid-cols-1 gap-3">
                          {aiResponse.keyPoints.map((pt: string, i: number) => (
                            <div key={i} className="flex items-center gap-4 text-base font-bold bg-secondary/30 p-5 rounded-2xl border border-primary/5 hover:border-primary/20 transition-all group/item">
                              <div className="h-3 w-3 rounded-full bg-accent group-hover/item:scale-125 transition-transform" />
                              {pt}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" className="w-full h-14 rounded-2xl text-primary font-black uppercase text-xs tracking-widest hover:bg-primary/10 border border-primary/5" onClick={() => setAiResponse(null)}>
                        Analyze New Topic
                      </Button>
                   </div>
                </Card>
              ) : (
                <div className="text-center space-y-10 group/placeholder">
                   <div className="h-48 w-48 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-2xl relative group-hover/lab:scale-110 transition-transform duration-700 border border-primary/5">
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20 animate-[spin_20s_linear_infinite]" />
                      <Sparkles className="h-20 w-20 text-primary animate-pulse" />
                   </div>
                   <div className="space-y-4 animate-bounce">
                     <p className="text-3xl font-headline font-bold text-primary/40 tracking-tight">System Ready for Input.</p>
                     <p className="text-base text-muted-foreground font-medium max-w-xs mx-auto leading-relaxed">Type any technical concept above to see our simplified academic breakdown.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Global Community Drive */}
      <section className="container mx-auto px-4 pt-24">
        <div className="bg-primary rounded-[4rem] p-16 md:p-32 text-center space-y-12 relative overflow-hidden shadow-[0_60px_120px_-20px_rgba(22,163,74,0.4)] border-4 border-white/5">
          <div className="absolute -top-20 -left-20 opacity-10 rotate-12 scale-150">
            <Heart className="h-96 w-96 text-white" />
          </div>
          <div className="absolute -bottom-20 -right-20 opacity-10 -rotate-12 scale-150">
            <GraduationCap className="h-96 w-96 text-white" />
          </div>
          
          <div className="max-w-4xl mx-auto space-y-10 relative z-10 animate-in slide-in-from-bottom-12 duration-1000">
            <h2 className="text-5xl md:text-8xl font-headline font-bold text-white tracking-tighter leading-[0.9]">Elevate Your <br />Academic Circle.</h2>
            <p className="text-xl md:text-3xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
              Knowledge shared is knowledge multiplied. Contribute to the largest study bank in the valley and help a fellow student succeed.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-10">
              <Button asChild size="lg" variant="secondary" className="rounded-[2rem] px-14 h-20 font-black text-2xl bg-white text-primary hover:scale-105 transition-all shadow-3xl border-none">
                <Link href="/upload">Upload Materials</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-[2rem] px-14 h-20 font-black text-2xl text-white border-white/40 hover:bg-white/10 transition-all backdrop-blur-3xl shadow-2xl">
                <Link href="/forum">Join The Discussion</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
