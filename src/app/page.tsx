"use client";

import { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BRANCHES } from '@/lib/mock-data';
import { DEPARTMENT_REPRESENTATIVES } from '@/lib/department-data';
import { 
  Search, BookOpen, Users, ArrowRight, GraduationCap, 
  FileText, Download, Code, Cpu, Hammer, Droplets, Zap, Beaker, Building2, Microscope, Heart,
  Linkedin, Mail, Sparkles, BrainCircuit, Rocket, Loader2
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

const BRANCH_ICONS: Record<string, any> = {
  'Information Technology': Code,
  'Computer Science & Engineering': Cpu,
  'Electrical Engineering': Zap,
  'Mechanical Engineering': Hammer,
  'Chemical Engineering': Beaker,
  'Civil Engineering': Building2,
  'Electronics & Communication Engineering': Droplets,
  'Metallurgical & Materials Engineering': Microscope,
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const { toast } = useToast();

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const heroSlides = useMemo(() => {
    const getImg = (id: string) => placeholderData.placeholderImages.find(img => img.id === id);
    
    return [
      { img: getImg('hero-nitsri-official'), title: 'NIT Srinagar', quote: 'Our beautiful home at Hazratbal.' },
      { img: getImg('it-dept-official'), title: 'IT Dept', quote: 'Building the software of tomorrow.' },
      { img: getImg('cse-dept-official'), title: 'CSE Dept', quote: 'Where logic meets innovation.' },
      { img: getImg('chem-dept-official'), title: 'Chemical Dept', quote: 'Transforming matter for the future.' },
      { img: getImg('ece-dept-official'), title: 'ECE Dept', quote: 'Connecting the world through signals.' },
      { img: getImg('mech-dept-official'), title: 'Mech Dept', quote: 'Moving the world with design.' },
      { img: getImg('ee-dept-official'), title: 'Electrical Dept', quote: 'Powering the future of the valley.' },
      { img: getImg('civil-dept-official'), title: 'Civil Dept', quote: 'Strong foundations for a better life.' },
      { img: getImg('meta-dept-official'), title: 'Metallurgy Dept', quote: 'Designing stronger materials.' },
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
    <div className="flex flex-col gap-12 pb-20">
      {/* Immersive Slideshow Section */}
      <section className="relative h-[65vh] min-h-[500px] overflow-hidden">
        <Carousel 
          className="w-full h-full"
          plugins={[autoplayPlugin.current]}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="h-[65vh] -ml-0">
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0 relative h-full w-full">
                <div className="relative h-full w-full">
                  <Image 
                    src={slide.img?.imageUrl || 'https://picsum.photos/seed/nitsri/1200/800'} 
                    alt={slide.title}
                    fill
                    className="object-cover opacity-100 brightness-110"
                    priority={index === 0}
                    data-ai-hint={slide.img?.imageHint || 'university campus'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent" />
                  
                  <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
                    <div className="max-w-2xl space-y-4 animate-in fade-in slide-in-from-left-8 duration-1000">
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/40 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-xl">
                        <GraduationCap className="h-4 w-4" /> {slide.title}
                      </div>
                      <h1 className="text-3xl md:text-5xl font-headline font-bold tracking-tighter text-white leading-tight drop-shadow-2xl">
                        {slide.quote}
                      </h1>
                      <p className="text-base md:text-lg text-white/90 font-medium max-w-lg leading-relaxed drop-shadow-lg">
                        Access high-quality peer notes and academic resources curated for NITians.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-3 pt-6 max-w-xl">
                        <div className="flex-grow flex items-center gap-4 px-6 h-14 rounded-2xl bg-white/10 backdrop-blur-3xl border border-white/30 shadow-2xl group focus-within:border-primary focus-within:bg-white/20 transition-all">
                          <Search className="h-5 w-5 text-white/70 group-focus-within:text-white" />
                          <input 
                            placeholder="Search subjects or topics..." 
                            className="bg-transparent border-none outline-none text-base w-full placeholder:text-white/60 text-white font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/browse?search=${searchQuery}`)}
                          />
                        </div>
                        <Button asChild size="lg" className="rounded-2xl px-8 h-14 font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
                          <Link href={`/browse?search=${searchQuery}`}>Search</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-10 right-10 flex gap-4 z-20">
            <CarouselPrevious className="relative left-0 translate-y-0 h-12 w-12 bg-white/10 backdrop-blur-2xl hover:bg-primary hover:text-white border-white/20 rounded-2xl transition-all shadow-xl" />
            <CarouselNext className="relative right-0 translate-y-0 h-12 w-12 bg-white/10 backdrop-blur-2xl hover:bg-primary hover:text-white border-white/20 rounded-2xl transition-all shadow-xl" />
          </div>
        </Carousel>
      </section>

      {/* Stats - Simple Labels */}
      <section className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Notes', value: '5,000+', icon: FileText, color: 'text-primary' },
            { label: 'Active Students', value: '12,000+', icon: Users, color: 'text-accent' },
            { label: 'Daily Downloads', value: '1,500+', icon: Download, color: 'text-primary' },
          ].map((stat, i) => (
            <div key={i} className="bg-card/95 backdrop-blur-2xl p-8 rounded-[2rem] flex items-center gap-6 border border-primary/5 shadow-2xl hover:border-primary/40 transition-all group">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:rotate-6 transition-transform shadow-inner">
                <stat.icon className="h-8 w-8" />
              </div>
              <div>
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Redefined AI Study Engine Section */}
      <section className="container mx-auto px-4 space-y-12 py-12">
        <div className="bg-primary/5 rounded-[3rem] p-8 md:p-16 border border-primary/10 relative overflow-hidden group/lab shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover/lab:rotate-12 transition-transform duration-1000">
             <BrainCircuit className="h-64 w-64 text-primary" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 relative z-10">
              <Badge className="bg-accent text-accent-foreground px-5 py-2 rounded-full font-black uppercase tracking-widest text-[11px] shadow-lg animate-pulse">
                <Sparkles className="h-3.5 w-3.5 mr-2 inline" /> Redefined AI Study Lab
              </Badge>
              <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary leading-tight">
                Master Hard <br /><span className="text-foreground">Topics Instantly.</span>
              </h2>
              <p className="text-lg text-muted-foreground font-medium max-w-md leading-relaxed">
                Stuck on a complex theory? Type it below and our NIT-tuned AI will explain it like a pro.
              </p>
              
              <div className="space-y-4">
                 <div className="flex flex-col sm:flex-row gap-3">
                   <div className="flex-grow relative">
                      <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary opacity-50 z-10" />
                      <input 
                        placeholder="e.g. Fourier Transform or MAIR11 Calculus" 
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        className="w-full pl-12 pr-4 h-16 rounded-2xl bg-secondary/30 border border-primary/10 focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none text-base font-bold text-foreground placeholder:text-muted-foreground shadow-inner relative z-0"
                      />
                   </div>
                   <Button 
                    onClick={handleAiSimplify}
                    disabled={isAiLoading || !aiTopic.trim()}
                    size="lg" 
                    className="rounded-2xl h-16 px-10 font-black text-lg bg-primary hover:scale-105 transition-all gap-2"
                   >
                     {isAiLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Rocket className="h-6 w-6" />}
                     Simplify
                   </Button>
                 </div>
              </div>
            </div>

            <div className="relative min-h-[350px] flex items-center justify-center">
              {aiResponse ? (
                <Card className="w-full bg-card border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-10 animate-in zoom-in-95 fade-in duration-500">
                   <CardHeader className="p-0 mb-6">
                      <div className="flex items-center gap-3 text-primary mb-2">
                        <BrainCircuit className="h-8 w-8" />
                        <CardTitle className="text-2xl font-bold">Concept Explained.</CardTitle>
                      </div>
                      <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Topic: {aiTopic}</p>
                   </CardHeader>
                   <CardContent className="p-0 space-y-6">
                      <div className="bg-primary/10 p-6 rounded-2xl border border-primary/5 text-lg leading-relaxed italic text-primary font-medium">
                        "{aiResponse.explanation}"
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Key Takeaways</p>
                        <div className="grid grid-cols-1 gap-2">
                          {aiResponse.keyPoints.map((pt: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-bold bg-secondary/40 p-3 rounded-xl">
                              <div className="h-2 w-2 rounded-full bg-accent" />
                              {pt}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" className="w-full h-12 rounded-xl text-primary font-bold hover:bg-primary/5" onClick={() => setAiResponse(null)}>
                        Clear & Try Another
                      </Button>
                   </CardContent>
                </Card>
              ) : (
                <div className="text-center space-y-8 group/placeholder">
                   <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto shadow-inner relative group-hover/lab:scale-110 transition-transform duration-500">
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-spin-slow" />
                      <Sparkles className="h-14 w-14 text-primary animate-pulse" />
                   </div>
                   <div className="space-y-3">
                     <p className="text-2xl font-headline font-bold text-primary/40">Enter a concept to start learning.</p>
                     <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">Our AI understands the specific NIT Srinagar syllabus and simplifies it just for you.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Department Quick Pick */}
      <section className="container mx-auto px-4 space-y-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-primary/10 pb-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold tracking-tight">Academic Vaults</h2>
            <p className="text-muted-foreground font-medium text-lg">Quickly navigate to your department's specialized resources.</p>
          </div>
          <Button variant="ghost" asChild className="rounded-xl font-bold text-primary hover:bg-primary/10 h-12 px-6">
            <Link href="/browse">Explore All <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || BookOpen;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="group hover:bg-primary transition-all duration-500 cursor-pointer rounded-[2rem] overflow-hidden border-primary/5 bg-secondary/30 hover:-translate-y-2 shadow-sm hover:shadow-2xl">
                  <CardContent className="flex flex-col items-center justify-center p-8 gap-5 text-center">
                    <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-white/20 transition-colors shadow-inner">
                      <Icon className="h-10 w-10 text-primary group-hover:text-white" />
                    </div>
                    <span className="font-bold text-sm group-hover:text-white transition-colors">{branch}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Mentors Section - Community Guidance */}
      <section className="bg-primary/5 py-24 border-y border-primary/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary blur-[100px]" />
          <div className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-accent blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/3 space-y-8">
              <Badge className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest">Connect & Grow</Badge>
              <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-primary leading-tight">Meet Your <br /><span className="text-foreground">Mentors.</span></h2>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-lg">
                Get guidance from senior representatives who have navigated the same path. Your academic success is a collective effort.
              </p>
              <Button asChild size="lg" className="rounded-2xl px-10 h-14 font-black text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                <Link href="/about">Meet All Reps</Link>
              </Button>
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {DEPARTMENT_REPRESENTATIVES.slice(0, 4).map((rep, idx) => (
                <Card key={idx} className="rounded-[2rem] border-primary/5 hover:border-primary/20 transition-all bg-card shadow-lg hover:shadow-2xl group overflow-hidden">
                  <CardContent className="p-8 flex items-center gap-6">
                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                      <Image 
                        src={rep.imageUrl} 
                        alt={rep.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-lg text-primary">{rep.name}</h4>
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{rep.branch}</p>
                      <div className="flex gap-3 pt-2">
                        <a href={rep.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                          <Linkedin className="h-4 w-4" />
                        </a>
                        <a href={`mailto:${rep.email}`} className="text-muted-foreground hover:text-accent transition-colors">
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="container mx-auto px-4 mt-12">
        <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -left-10 opacity-10">
            <Heart className="h-64 w-64 text-white" />
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <GraduationCap className="h-96 w-96 text-white" />
          </div>
          
          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <h2 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tighter leading-tight">Empower Your <br />Academic Circle.</h2>
            <p className="text-lg md:text-2xl text-white/90 font-medium max-w-xl mx-auto leading-relaxed">
              Every student has something to share. Contribute to the largest study bank in NIT Srinagar.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <Button asChild size="lg" variant="secondary" className="rounded-2xl px-12 h-16 font-black text-xl bg-white text-primary hover:scale-105 transition-all shadow-2xl border-none">
                <Link href="/upload">Upload Materials</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-2xl px-12 h-16 font-black text-xl text-white border-white/40 hover:bg-white/10 transition-all backdrop-blur-sm">
                <Link href="/forum">Join Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
