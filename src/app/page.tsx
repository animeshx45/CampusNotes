
"use client";

import { useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BRANCHES } from '@/lib/mock-data';
import { 
  Search, BookOpen, Users, Sparkles, ArrowRight, GraduationCap, 
  FileText, Download, Code, Cpu, Hammer, Droplets, Zap, Beaker, Building2, Microscope, Heart
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

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Immersive Slideshow Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Carousel 
          className="w-full h-full"
          plugins={[autoplayPlugin.current]}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="h-[70vh] -ml-0">
            {heroSlides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0 relative h-full w-full">
                <div className="relative h-full w-full">
                  <Image 
                    src={slide.img?.imageUrl || 'https://picsum.photos/seed/nitsri/1200/800'} 
                    alt={slide.title}
                    fill
                    className="object-cover opacity-90 brightness-[0.95]"
                    priority={index === 0}
                    data-ai-hint={slide.img?.imageHint || 'university campus'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent" />
                  
                  <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
                    <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/30 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                        <GraduationCap className="h-3.5 w-3.5" /> {slide.title}
                      </div>
                      <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter text-white leading-[0.85] drop-shadow-2xl">
                        {slide.quote}
                      </h1>
                      <p className="text-xl md:text-2xl text-white font-medium max-w-xl leading-relaxed drop-shadow-md">
                        Access high-quality peer notes and academic resources curated for NITians.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <div className="flex-grow flex items-center gap-3 px-6 h-16 rounded-2xl bg-white/20 backdrop-blur-2xl border border-white/30 shadow-2xl group focus-within:border-primary transition-all">
                          <Search className="h-5 w-5 text-white" />
                          <input 
                            placeholder="Search subjects or topics..." 
                            className="bg-transparent border-none outline-none text-lg w-full placeholder:text-white/60 text-white font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (window.location.href = `/browse?search=${searchQuery}`)}
                          />
                        </div>
                        <Button asChild size="lg" className="rounded-2xl px-12 h-16 font-black text-xl shadow-2xl shadow-primary/40 hover:scale-105 transition-transform">
                          <Link href={`/browse?search=${searchQuery}`}>Search</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-10 right-10 flex gap-3 z-20">
            <CarouselPrevious className="relative left-0 translate-y-0 h-12 w-12 bg-white/20 backdrop-blur-md hover:bg-primary hover:text-white border-white/30 rounded-2xl transition-all" />
            <CarouselNext className="relative right-0 translate-y-0 h-12 w-12 bg-white/20 backdrop-blur-md hover:bg-primary hover:text-white border-white/30 rounded-2xl transition-all" />
          </div>
        </Carousel>
      </section>

      {/* Stats - Simple Labels */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Notes', value: '5,000+', icon: FileText, color: 'text-primary' },
            { label: 'Active Students', value: '12,000+', icon: Users, color: 'text-accent' },
            { label: 'Daily Downloads', value: '1,500+', icon: Download, color: 'text-primary' },
          ].map((stat, i) => (
            <div key={i} className="bg-card/95 backdrop-blur-xl p-8 rounded-[2.5rem] flex items-center gap-6 border border-white/10 shadow-2xl hover:border-primary/40 transition-all group">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:rotate-6 transition-transform">
                <stat.icon className="h-8 w-8" />
              </div>
              <div>
                <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Department Quick Pick */}
      <section className="container mx-auto px-4 space-y-10 mt-8">
        <div className="flex justify-between items-end border-b border-primary/10 pb-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-headline font-bold tracking-tight">Academic Vaults</h2>
            <p className="text-muted-foreground font-medium text-lg">Quickly navigate to your department's specialized resources.</p>
          </div>
          <Button variant="ghost" asChild className="rounded-full font-bold text-primary hover:bg-primary/5 h-12">
            <Link href="/browse">Explore All <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || BookOpen;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="group hover:bg-primary transition-all duration-500 cursor-pointer rounded-[2rem] overflow-hidden border-primary/5 bg-secondary/30 hover:-translate-y-2">
                  <CardContent className="flex flex-col items-center justify-center p-10 gap-5 text-center">
                    <div className="p-5 rounded-3xl bg-primary/10 group-hover:bg-white/20 transition-colors">
                      <Icon className="h-12 w-12 text-primary group-hover:text-white" />
                    </div>
                    <span className="font-bold text-base group-hover:text-white transition-colors">{branch}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Help Section - Simple Language */}
      <section className="bg-primary/5 py-24 border-y border-primary/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary blur-[100px]" />
          <div className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-accent blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <Badge className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest">GenAI Study Engine</Badge>
              <h2 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-primary leading-none">Smart Study <br /><span className="text-foreground">Solutions.</span></h2>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-lg">
                Stop spending hours deciphering complex topics. Our AI companion synthesizes your course materials into digestible summaries and practice tests.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-6 p-8 rounded-[2.5rem] bg-background border border-primary/10 shadow-sm hover:shadow-2xl transition-all">
                  <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0"><Sparkles className="h-8 w-8" /></div>
                  <div>
                    <p className="font-bold text-lg">Instant Summaries</p>
                    <p className="text-sm text-muted-foreground mt-1">Grasp core concepts in seconds.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 p-8 rounded-[2.5rem] bg-background border border-primary/10 shadow-sm hover:shadow-2xl transition-all">
                  <div className="h-14 w-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent shrink-0"><Cpu className="h-8 w-8" /></div>
                  <div>
                    <p className="font-bold text-lg">Mock Examiners</p>
                    <p className="text-sm text-muted-foreground mt-1">Simulate exams with AI questions.</p>
                  </div>
                </div>
              </div>
              <Button asChild size="lg" className="rounded-2xl px-14 h-16 font-black text-xl mt-6 shadow-2xl shadow-primary/20">
                <Link href="/browse">Experience Smart Study</Link>
              </Button>
            </div>
            <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl border-[16px] border-white/5 group bg-card">
              <Image 
                src="https://media.istockphoto.com/id/692132510/photo/programming-code-abstract-screen-of-software-developer-computer-code-development.jpg?s=170667a&w=0&k=20&c=Nmn8TQ7YHr-juDqb4_lglRZDePrXJI2qB5nC3OXuSV0=" 
                alt="AI Helper" 
                fill 
                className="object-cover transition-all duration-700 group-hover:scale-110 brightness-110"
              />
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-12 left-12 right-12 bg-white/20 backdrop-blur-3xl p-8 rounded-3xl border border-white/30">
                 <p className="text-white font-bold text-xl mb-3">"Analysis: Operating Systems V2"</p>
                 <div className="flex gap-2 mt-2">
                    <div className="h-1.5 flex-1 bg-primary rounded-full" />
                    <div className="h-1.5 flex-1 bg-primary rounded-full" />
                    <div className="h-1.5 flex-1 bg-white/20 rounded-full" />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Community Section - Very Simple */}
      <section className="container mx-auto px-4 mt-12">
        <div className="bg-primary rounded-[4rem] p-16 md:p-24 text-center space-y-12 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -left-10 opacity-10">
            <Heart className="h-72 w-72 text-white" />
          </div>
          <div className="absolute -bottom-20 -right-20 opacity-10">
            <GraduationCap className="h-[30rem] w-[30rem] text-white" />
          </div>
          
          <div className="max-w-4xl mx-auto space-y-10 relative z-10">
            <h2 className="text-6xl md:text-8xl font-headline font-bold text-white tracking-tighter leading-[0.8]">Empower Your <br />Academic Circle.</h2>
            <p className="text-xl md:text-3xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
              Every student has something to share. Contribute to the largest study bank in NIT Srinagar.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
              <Button asChild size="lg" variant="secondary" className="rounded-[1.5rem] px-16 h-20 font-black text-2xl bg-white text-primary hover:scale-105 transition-all shadow-2xl">
                <Link href="/upload">Upload Materials</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-[1.5rem] px-16 h-20 font-black text-2xl text-white border-white/40 hover:bg-white/10 transition-all">
                <Link href="/forum">Join Community</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
