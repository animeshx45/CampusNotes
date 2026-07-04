
"use client";

import { useState } from 'react';
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

const HERO_SLIDES = [
  { 
    url: 'https://nitsri.ac.in/upload/slide-1-new.jpg', 
    title: 'NIT Srinagar', 
    quote: 'Our beautiful home at Hazratbal.' 
  },
  { 
    url: 'https://nitsri.ac.in/SliderPhoto/2064.jpg', 
    title: 'IT Dept', 
    quote: 'Building the software of tomorrow.' 
  },
  { 
    url: 'https://nitsri.ac.in/SliderPhoto/3665.jpg', 
    title: 'CSE Dept', 
    quote: 'Where logic meets innovation.' 
  },
  { 
    url: 'https://nitsri.ac.in/SliderPhoto/4860.jpg', 
    title: 'Mech Dept', 
    quote: 'Moving the world with design.' 
  },
  { 
    url: 'https://nitsri.ac.in/SliderPhoto/3225.jpg', 
    title: 'Electrical Dept', 
    quote: 'Powering the future of the valley.' 
  },
  { 
    url: 'https://nitsri.ac.in/SliderPhoto/3189.jpg', 
    title: 'Civil Dept', 
    quote: 'Strong foundations for a better life.' 
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Immersive Slideshow Section */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Carousel 
          className="w-full h-full"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="h-[60vh] -ml-0">
            {HERO_SLIDES.map((slide, index) => (
              <CarouselItem key={index} className="pl-0 relative h-full w-full">
                <div className="relative h-full w-full">
                  <Image 
                    src={slide.url} 
                    alt={slide.title}
                    fill
                    className="object-cover opacity-70"
                    priority={index === 0}
                    data-ai-hint="university campus"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
                  <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-20">
                    <div className="max-w-md space-y-3 animate-in fade-in slide-in-from-left-5 duration-700 bg-background/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
                      <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[9px] font-black uppercase tracking-widest border border-primary/30">
                        <GraduationCap className="h-3 w-3" /> {slide.title}
                      </div>
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                        {slide.quote}
                      </h1>
                      
                      <div className="flex gap-2 bg-card/80 p-1.5 rounded-xl border border-primary/10 w-full mt-4">
                        <div className="flex-grow flex items-center gap-2 px-3">
                          <Search className="h-4 w-4 text-primary" />
                          <input 
                            placeholder="Find your subject..." 
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/50 text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Button asChild size="sm" className="rounded-lg px-4 h-9 font-bold">
                          <Link href={`/browse?search=${searchQuery}`}>Go</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-6 right-6 flex gap-2 z-20">
            <CarouselPrevious className="relative left-0 translate-y-0 h-8 w-8 bg-background/50 hover:bg-primary hover:text-white border-primary/20" />
            <CarouselNext className="relative right-0 translate-y-0 h-8 w-8 bg-background/50 hover:bg-primary hover:text-white border-primary/20" />
          </div>
        </Carousel>
      </section>

      {/* Stats - Simple Labels */}
      <section className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Notes', value: '5,000+', icon: FileText },
            { label: 'Active Students', value: '12,000+', icon: Users },
            { label: 'Daily Downloads', value: '1,500+', icon: Download },
          ].map((stat, i) => (
            <div key={i} className="bg-card/90 backdrop-blur-md p-4 rounded-xl flex items-center gap-4 border border-primary/10 shadow-lg hover:border-primary/40 transition-all group">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:rotate-6 transition-transform">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-primary">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Department Quick Pick */}
      <section className="container mx-auto px-4 space-y-6">
        <div className="flex justify-between items-end border-b border-primary/10 pb-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Select Your Branch</h2>
            <p className="text-muted-foreground text-sm">Quickly find notes for your specific course.</p>
          </div>
          <Button variant="ghost" asChild className="rounded-full text-xs font-bold text-primary">
            <Link href="/browse">View All <ArrowRight className="ml-2 h-3 w-3" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || BookOpen;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="group hover:bg-primary transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden border-primary/5 bg-secondary/20">
                  <CardContent className="flex flex-col items-center justify-center p-6 gap-3 text-center">
                    <div className="p-3 rounded-xl bg-primary/5 group-hover:bg-white/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary group-hover:text-white" />
                    </div>
                    <span className="font-bold text-xs group-hover:text-white transition-colors">{branch}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Help Section - Simple Language */}
      <section className="bg-primary/5 py-16 border-y border-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">AI Study Tools</Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary leading-tight">Learn Much <br /><span className="text-foreground">Faster.</span></h2>
              <p className="text-lg text-muted-foreground font-medium">
                Our AI buddy reads your notes and makes quick summaries so you don't have to spend hours on one page.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-primary/5 shadow-sm">
                  <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><Sparkles className="h-5 w-5" /></div>
                  <div>
                    <p className="font-bold text-sm">Note Summaries</p>
                    <p className="text-xs text-muted-foreground">Get the main points in seconds.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-background border border-primary/5 shadow-sm">
                  <div className="h-10 w-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0"><Cpu className="h-5 w-5" /></div>
                  <div>
                    <p className="font-bold text-sm">Exam Questions</p>
                    <p className="text-xs text-muted-foreground">Practice with AI-made tests.</p>
                  </div>
                </div>
              </div>
              <Button asChild size="lg" className="rounded-2xl px-10 h-14 font-bold mt-4 shadow-xl shadow-primary/20">
                <Link href="/browse">Start Studying</Link>
              </Button>
            </div>
            <div className="relative aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-primary/5 group bg-card">
              <Image 
                src="https://media.istockphoto.com/id/692132510/photo/programming-code-abstract-screen-of-software-developer-computer-code-development.jpg?s=170667a&w=0&k=20&c=Nmn8TQ7YHr-juDqb4_lglRZDePrXJI2qB5nC3OXuSV0=" 
                alt="AI Helper" 
                fill 
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Community Section - Very Simple */}
      <section className="container mx-auto px-4">
        <div className="bg-primary rounded-[3rem] p-10 md:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -left-10 opacity-10">
            <Heart className="h-40 w-40 text-white" />
          </div>
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-none">Share Your Notes. <br />Help a Friend.</h2>
            <p className="text-lg md:text-xl text-white/80 font-medium max-w-xl mx-auto">
              Got great notes? Upload them now! One small share from you can help hundreds of students pass their exams.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" variant="secondary" className="rounded-2xl px-12 h-16 font-bold text-lg bg-white text-primary hover:scale-105 transition-all shadow-xl">
                <Link href="/upload">Upload Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-2xl px-12 h-16 font-bold text-lg text-white border-white/40 hover:bg-white/10 transition-all">
                <Link href="/forum">Join the Chat</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
