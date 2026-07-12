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
  Sparkles, BrainCircuit, Rocket, Loader2, Bell, Share2, MessageCircle, ShieldCheck, AlertTriangle, Heart,
  Briefcase,
} from 'lucide-react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import placeholderData from "@/app/lib/placeholder-images.json";
import { simplifyConcept } from '@/ai/flows/simplify-concept-flow';
import { useToast } from '@/hooks/use-toast';
import { StudyMaterial, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

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
  'Placement Materials': Briefcase,
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<any>(null);
  const { toast } = useToast();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true })
  );

  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resMat = await fetch('/api/materials');
        if (resMat.ok) {
          const json = await resMat.json();
          setMaterials(json.data || []);
        }
        const resUsers = await fetch('/api/users');
        if (resUsers.ok) {
          const json = await resUsers.json();
          setUsers(json.data || []);
        }
      } catch (e) {
        console.error("Failed to load homepage stats", e);
      }
    };
    fetchStats();
  }, []);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    
    // Core popular subjects at NIT Srinagar
    const popularSubjects = [
      'Mathematics I', 'Mathematics II', 'Mathematics III',
      'Engineering Physics', 'Engineering Chemistry', 'Environmental Studies',
      'Computer Programming', 'Data Structures', 'Database Management Systems',
      'Design & Analysis of Algorithms', 'Operating Systems', 'Computer Networks',
      'Artificial Intelligence', 'Machine Learning', 'Big Data',
      'Object Oriented Programming', 'Internet & Web Technologies',
      'Fluid Mechanics', 'Engineering Mechanics', 'Mechanics of Materials',
      'Thermodynamics', 'Heat Transfer', 'Theory of Machines',
      'Basic Electrical Engineering', 'Control Systems', 'Power Electronics',
      'Electronics-I', 'Signals and Systems', 'VLSI Design',
      'Physical Metallurgy', 'Corrosion Engineering', 'Metal Casting'
    ];

    const uniqueSuggestions = new Set<string>();

    // 1. Match against popular subjects
    popularSubjects.forEach(subject => {
      if (subject.toLowerCase().includes(query)) {
        uniqueSuggestions.add(subject);
      }
    });

    // 2. Match against dynamic database materials subjects and titles
    materials.forEach(m => {
      if (m.subject && m.subject.toLowerCase().includes(query)) {
        uniqueSuggestions.add(m.subject);
      }
      if (m.title && m.title.toLowerCase().includes(query)) {
        const cleanTitle = m.title.split('(')[0].trim();
        if (cleanTitle.toLowerCase().includes(query)) {
          uniqueSuggestions.add(cleanTitle);
        }
      }
    });

    return Array.from(uniqueSuggestions).slice(0, 6);
  }, [searchQuery, materials]);

  const stats = useMemo(() => {
    const totalNotes = materials?.length || 0;
    const totalStudents = users?.length || 0;
    const totalDownloads = materials?.reduce((acc, m) => acc + (m.downloadCount || 0), 0) || 0;

    return [
      { label: 'Total Notes', value: totalNotes.toLocaleString(), icon: FileText, color: 'text-primary' },
      { label: 'Students Helped', value: totalStudents.toLocaleString(), icon: Users, color: 'text-accent' },
      { label: 'Total Downloads', value: totalDownloads.toLocaleString(), icon: Download, color: 'text-primary' },
    ];
  }, [materials, users]);

  const heroSlides = useMemo(() => {
    const getImg = (id: string) => placeholderData.placeholderImages.find(img => img.id === id);
    
    return [
      { img: getImg('hero-nitsri-official'), title: 'NIT Srinagar', quote: 'The Ultimate Peer-to-Peer Study Resource Portal.' },
      { img: getImg('it-dept-official'), title: 'IT Dept.', quote: 'Driving Innovation through Advanced Computation.' },
      { img: getImg('cse-dept-official'), title: 'CSE Dept.', quote: 'Architecting the Future of Intelligent Systems.' },
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
    <div className="flex flex-col pb-20 w-full overflow-x-hidden gpu-smooth">
      {/* Slideshow Section */}
      <section className="relative min-h-[600px] h-[70vh] md:h-[85vh] md:min-h-[850px] w-full overflow-hidden">
        <Carousel 
          className="w-full h-full [&>div.overflow-hidden]:h-full"
          plugins={[autoplayPlugin.current]}
          opts={{ loop: true, dragFree: true }}
          setApi={setApi}
        >
          <CarouselContent className="h-full -ml-0">
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0 relative h-full w-full">
                <div className="relative h-full w-full">
                  <Image 
                    src={slide.img?.imageUrl || 'https://picsum.photos/seed/nitsri/1200/800'} 
                    alt={slide.title}
                    fill
                    className="object-cover brightness-[0.45] contrast-[1.05]"
                    priority={index === 0}
                    data-ai-hint="university campus"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/10" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-24 md:bottom-40 right-4 md:right-16 flex gap-3 md:gap-4 z-30 scale-90 md:scale-100">
            <CarouselPrevious className="relative left-0 translate-y-0 h-12 w-12 md:h-14 md:w-14 bg-white/5 backdrop-blur-3xl hover:bg-primary/60 hover:text-white border border-white/10 rounded-2xl transition-all shadow-2xl" />
            <CarouselNext className="relative right-0 translate-y-0 h-12 w-12 md:h-14 md:w-14 bg-white/5 backdrop-blur-3xl hover:bg-primary/60 hover:text-white border border-white/10 rounded-2xl transition-all shadow-2xl" />
          </div>
        </Carousel>

        {/* Hero Content (Static on top) */}
        <div className={`absolute inset-0 ${showSuggestions && suggestions.length > 0 ? 'z-[60]' : 'z-10'} flex flex-col justify-center items-center text-center pointer-events-none`}>
          <div className="container mx-auto px-4 py-20 max-w-5xl space-y-6 md:space-y-10 pointer-events-auto">
            {/* Slide-specific elements re-render nicely on change with current key */}
            <div key={current} className="space-y-6 md:space-y-10 animate-in fade-in duration-500">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 md:px-6 md:py-2.5 rounded-full bg-white/5 backdrop-blur-3xl text-white text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em] border border-white/10 shadow-2xl">
                <GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-accent" /> {heroSlides[current]?.title || 'NIT Srinagar'}
              </div>
              <h1 className="text-4xl md:text-7xl lg:text-8xl font-headline font-bold tracking-tighter text-white leading-[1.05] drop-shadow-2xl px-2">
                {heroSlides[current]?.quote || 'The Ultimate Peer-to-Peer Study Resource Portal.'}
              </h1>
            </div>
            
            {/* Static content that never changes or re-renders */}
            <p className="text-sm md:text-xl text-white/80 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-lg opacity-80 px-4">
              The easiest way to find notes, papers, and help for your exams at NIT Srinagar.
            </p>
            
            {/* Search Bar - Completely static, interactive, and preserved */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-6 px-4">
              <div className="w-full sm:w-[400px] lg:w-[500px] relative group z-20">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <input 
                  placeholder="Search subjects or papers..." 
                  className="w-full h-14 md:h-16 pl-12 pr-6 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 text-white font-bold placeholder:text-white/30 focus:ring-4 focus:ring-primary/40 transition-all outline-none text-base md:text-lg shadow-2xl shadow-black/50"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setShowSuggestions(false);
                      window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
                    }
                  }}
                />

                {/* Autocomplete / Recommendations Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 shadow-2xl z-50 text-left overflow-hidden divide-y divide-white/5 animate-in fade-in slide-in-from-top-2 duration-200">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onMouseDown={() => {
                          setSearchQuery(suggestion);
                          setShowSuggestions(false);
                          window.location.href = `/browse?search=${encodeURIComponent(suggestion)}`;
                        }}
                        className="w-full text-left px-5 py-3.5 text-sm md:text-base font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-3"
                      >
                        <Search className="h-4 w-4 text-primary shrink-0" />
                        <span className="truncate">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button asChild size="lg" className="rounded-2xl h-14 md:h-16 px-10 font-black text-lg md:text-xl shadow-2xl backdrop-blur-xl bg-primary/95 hover:bg-primary border border-white/10 hover:scale-[1.03] transition-transform active:scale-95">
                <Link href={`/browse?search=${encodeURIComponent(searchQuery)}`}>Find Notes</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Ticker Bar */}
        <div className="absolute bottom-0 w-full bg-secondary/90 backdrop-blur-3xl border-t border-white/5 py-4 z-40">
          <div className="container mx-auto px-4 flex items-center gap-6">
            <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] md:text-[11px] tracking-widest shrink-0 border-r border-white/10 pr-6">
              <Bell className="h-4 w-4" /> <span>Updates:</span>
            </div>
            <div className="overflow-hidden relative flex-grow h-6 group">
              <div className="animate-marquee group-hover:pause flex gap-12 md:gap-24 text-xs md:text-sm font-bold text-muted-foreground/90">
                <span className="shrink-0">• End Semester papers added for 2024</span>
                <span className="shrink-0">• Mechanical Lab Manuals added for Semester 4</span>
                <span className="shrink-0">• New Discussion: GATE 2025 Study Plan</span>
                <span className="shrink-0">• Share your mid-sem notes to help others</span>
                <span className="shrink-0">• Chemical Engineering notes published by Faculty</span>
                {/* Duplicate for seamless loop */}
                <span className="shrink-0">• End Semester papers added for 2024</span>
                <span className="shrink-0">• Mechanical Lab Manuals added for Semester 4</span>
                <span className="shrink-0">• New Discussion: GATE 2025 Study Plan</span>
                <span className="shrink-0">• Share your mid-sem notes to help others</span>
                <span className="shrink-0">• Chemical Engineering notes published by Faculty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="container mx-auto px-4 -mt-16 md:-mt-24 relative z-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] flex flex-col gap-4 border border-white/10 shadow-3xl hover:border-primary/50 hover:bg-white/10 transition-all duration-500 group overflow-hidden relative">
              <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                <stat.icon className="h-32 w-32 md:h-40 md:w-40 text-white" />
              </div>
              <div className="h-14 w-14 md:h-16 md:w-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary shadow-inner border border-white/5">
                <stat.icon className="h-7 w-7 md:h-8 md:w-8" />
              </div>
              <div>
                <p className={`text-5xl md:text-6xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] md:text-[11px] text-muted-foreground font-black uppercase tracking-[0.4em] mt-2">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Moving Disclaimer Notice */}
      <div className="bg-accent/10 border-y border-accent/20 py-4 overflow-hidden relative z-40 mt-12 md:mt-16">
        <div className="flex animate-marquee">
          <span className="text-accent font-black uppercase text-[10px] md:text-[11px] tracking-[0.3em] flex items-center gap-12 px-8 whitespace-nowrap">
            <AlertTriangle className="h-4 w-4" />
            NOTICE: THIS IS NOT THE OFFICIAL NIT SRINAGAR WEBSITE AND IS MADE BY STUDENTS OF NIT SRINAGAR.
            <AlertTriangle className="h-4 w-4" />
            NOTICE: THIS IS NOT THE OFFICIAL NIT SRINAGAR WEBSITE AND IS MADE BY STUDENTS OF NIT SRINAGAR.
            <AlertTriangle className="h-4 w-4" />
            NOTICE: THIS IS NOT THE OFFICIAL NIT SRINAGAR WEBSITE AND IS MADE BY STUDENTS OF NIT SRINAGAR.
            <AlertTriangle className="h-4 w-4" />
            NOTICE: THIS IS NOT THE OFFICIAL NIT SRINAGAR WEBSITE AND IS MADE BY STUDENTS OF NIT SRINAGAR.
          </span>
        </div>
      </div>

      {/* Branches Grid */}
      <section className="container mx-auto px-4 space-y-12 md:space-y-20 py-20 md:py-32">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 border-b border-white/5 pb-12">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-none rounded-full px-5 py-1.5 font-black tracking-[0.2em] text-[10px]">NOTES LIBRARY</Badge>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight text-primary">Browse by Branch.</h2>
            <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl leading-relaxed">Find verified resources curated by seniors for all engineering departments.</p>
          </div>
          <Button variant="outline" asChild className="rounded-2xl font-black text-xs uppercase tracking-widest border border-white/10 bg-white/5 backdrop-blur-xl h-14 md:h-16 px-10 hover:bg-primary hover:text-white transition-all w-full md:w-auto active:scale-95 shadow-xl">
            <Link href="/browse">See All Notes <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || BookOpen;
            return (
              <Link 
                key={branch} 
                href={branch === 'Placement Materials' ? '/placement-materials' : `/browse?branch=${encodeURIComponent(branch)}`} 
                className="group"
              >
                <Card className="hover:bg-primary/95 transition-all duration-500 cursor-pointer rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:-translate-y-4 shadow-sm hover:shadow-[0_40px_80px_-20px_rgba(22,163,74,0.35)] h-full gpu-smooth">
                  <CardContent className="flex flex-col items-center justify-center p-8 md:p-14 gap-6 text-center h-full">
                    <div className="p-5 md:p-8 rounded-2xl bg-white/5 group-hover:bg-white/20 transition-all duration-700 shadow-inner group-hover:rotate-12 border border-white/5">
                      <Icon className="h-10 w-10 md:h-12 md:w-12 text-primary group-hover:text-white transition-colors duration-500" />
                    </div>
                    <span className="font-bold text-base md:text-lg tracking-tight leading-tight group-hover:text-white transition-colors duration-500">{branch}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] p-6 md:p-12 border border-white/10 relative overflow-hidden group/lab shadow-3xl">
          <div className="absolute -top-20 -right-20 p-20 opacity-5 pointer-events-none group-hover/lab:rotate-45 transition-transform duration-[3000ms]">
             <BrainCircuit className="h-60 w-60 md:h-[20rem] md:w-[20rem] text-primary" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 relative z-10">
              <div className="space-y-3">
                <Badge className="bg-accent/80 text-accent-foreground px-4 py-1 rounded-full font-bold uppercase tracking-widest text-[9px] shadow-md animate-pulse backdrop-blur-xl border border-white/20">
                  <Sparkles className="h-3 w-3 mr-1.5 inline" /> AI Study Assistant
                </Badge>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tighter text-primary leading-[0.95]">
                  Learn Hard <br /><span className="text-foreground italic">Concepts.</span>
                </h2>
                <p className="text-sm md:text-base text-muted-foreground font-medium max-w-md leading-relaxed">
                  Confused by a topic? Our AI Buddy breaks down complex engineering theories into simple analogies.
                </p>
              </div>
              
              <div className="space-y-4 max-w-lg">
                 <div className="flex flex-col sm:flex-row gap-3">
                   <div className="flex-grow relative group">
                      <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/40 group-focus-within:text-primary z-10 transition-colors" />
                      <input 
                        placeholder="e.g. Backpropagation" 
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        className="w-full h-12 pl-12 pr-6 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/20 focus:ring-2 focus:ring-primary/40 outline-none text-sm font-normal text-white placeholder:text-white/30 shadow-inner transition-all"
                      />
                   </div>
                   <Button 
                    onClick={handleAiSimplify}
                    disabled={isAiLoading || !aiTopic.trim()}
                    size="default" 
                    className="rounded-xl h-12 px-8 font-bold text-sm bg-primary/95 hover:bg-primary backdrop-blur-xl border border-white/10 hover:scale-[1.02] transition-all active:scale-95 gap-2 shadow-xl shadow-primary/30"
                   >
                     {isAiLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5" />}
                     Explain
                   </Button>
                 </div>
              </div>
            </div>

            <div className="relative min-h-[300px] md:min-h-[400px] flex items-center justify-center">
              {aiResponse ? (
                <Card className="w-full bg-white/5 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-[2rem] p-6 md:p-8 animate-in zoom-in-95 fade-in slide-in-from-bottom-12 duration-700 gpu-smooth">
                   <div className="flex items-center gap-4 text-primary mb-6 border-b border-white/10 pb-4">
                      <div className="h-10 w-10 md:h-12 md:w-12 bg-white/5 rounded-xl flex items-center justify-center shadow-inner border border-white/10">
                        <BrainCircuit className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold tracking-tight">AI Insights</h3>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground opacity-70">Topic: {aiTopic}</p>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="bg-white/5 p-5 md:p-6 rounded-2xl border border-white/10 text-xs md:text-sm leading-relaxed text-foreground/90 font-normal shadow-inner">
                        "{aiResponse.explanation}"
                      </div>
                      <div className="space-y-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1">Key Takeaways</p>
                        <div className="grid grid-cols-1 gap-2.5">
                          {aiResponse.keyPoints.map((pt: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 text-xs font-normal text-muted-foreground bg-white/5 backdrop-blur-xl p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-all group/item">
                              <div className="h-2 w-2 rounded-full bg-accent group-hover/item:scale-125 transition-transform shadow-[0_0_8px_rgba(234,179,8,0.2)] shrink-0" />
                              <span className="flex-grow">{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="ghost" className="w-full h-11 rounded-xl text-primary font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 border border-white/10 mt-2 backdrop-blur-xl active:scale-95" onClick={() => setAiResponse(null)}>
                        Explain Another Topic
                      </Button>
                   </div>
                </Card>
              ) : (
                <div className="text-center space-y-6 group/placeholder">
                   <div className="h-32 w-32 md:h-44 md:w-44 bg-white/5 backdrop-blur-2xl rounded-full flex items-center justify-center mx-auto shadow-2xl relative group-hover/lab:scale-105 transition-transform duration-1000 border border-white/10">
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/20 animate-[spin_40s_linear_infinite]" />
                      <Sparkles className="h-12 w-12 md:h-16 md:w-16 text-primary animate-pulse" />
                   </div>
                   <div className="space-y-2 animate-bounce">
                     <p className="text-xl md:text-3xl font-headline font-bold text-primary/40 tracking-tighter">Ready to Study.</p>
                     <p className="text-xs md:text-sm text-muted-foreground font-medium max-w-[200px] md:max-w-xs mx-auto leading-relaxed">Type any complex topic to get an instant explanation.</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Community Section - Reverted to reasonable size */}
      <section className="container mx-auto px-4 pt-16 md:pt-24 pb-20 md:pb-24">
        <div className="relative rounded-[2.5rem] md:rounded-[4rem] overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10 group/cta shadow-3xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(22,163,74,0.2),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(45,185,116,0.15),transparent_70%)]" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 p-8 md:p-20 items-center">
            <div className="space-y-8 md:space-y-10 text-center lg:text-left">
              <div className="space-y-4 md:space-y-6">
                <Badge className="bg-primary/10 text-primary border border-white/10 backdrop-blur-xl rounded-full px-5 py-1.5 font-black tracking-widest text-[10px]">HELP YOUR FRIENDS</Badge>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tighter text-white leading-[0.95]">
                  Share and <br />Help <span className="text-primary italic">Others.</span>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-90">
                  Join NIT Srinagar's fastest-growing student community sharing resources for every exam.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-start">
                <Button asChild size="lg" className="h-14 md:h-16 rounded-xl md:rounded-2xl px-8 md:px-12 font-black text-lg md:text-xl shadow-2xl bg-primary/95 hover:bg-primary backdrop-blur-xl border border-white/20 transition-all hover:scale-105 active:scale-95 group/btn w-full sm:w-auto">
                  <Link href="/upload" className="flex items-center justify-center gap-3">
                    Start Sharing <Share2 className="h-5 w-5 md:h-6 md:w-6 group-hover/btn:rotate-12 transition-transform duration-500" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 md:h-16 rounded-xl md:rounded-2xl px-8 md:px-12 font-black text-lg md:text-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all hover:scale-105 active:scale-95 group/btn2 w-full sm:w-auto shadow-xl">
                  <Link href="/forum" className="flex items-center justify-center gap-3">
                    Join Chat <MessageCircle className="h-5 w-5 md:h-6 md:w-6 group-hover/btn2:-translate-y-2 transition-transform duration-500" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Benefit Cards */}
            <div className="grid grid-cols-2 gap-4 md:gap-8 relative pt-8 lg:pt-0">
              {[
                { title: 'Study Hub', desc: 'All 8 branches covered.', icon: GraduationCap, color: 'text-primary' },
                { title: 'Verified', desc: 'Notes from top seniors.', icon: ShieldCheck, color: 'text-accent' },
                { title: 'Active', desc: 'Daily updates from students.', icon: Users, color: 'text-primary' },
                { title: 'Support', desc: 'By students, for students.', icon: Heart, color: 'text-accent' },
              ].map((benefit, i) => (
                <Card key={i} className={cn(
                  "bg-white/5 backdrop-blur-3xl border border-white/10 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] hover:-translate-y-2 transition-all duration-700 shadow-2xl group/card gpu-smooth",
                  i % 2 !== 0 ? "translate-y-6 md:translate-y-12 hover:translate-y-4 md:hover:translate-y-10" : ""
                )}>
                  <div className={cn(
                    "h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 group-hover/card:bg-foreground group-hover/card:text-background transition-all duration-500 border border-white/5 shadow-inner",
                    benefit.color === 'text-primary' ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                  )}>
                    <benefit.icon className="h-5 w-5 md:h-7 md:w-7" />
                  </div>
                  <h3 className="text-base md:text-xl font-bold mb-1 text-white">{benefit.title}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground font-medium leading-relaxed">{benefit.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
