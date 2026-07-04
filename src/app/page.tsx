
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
    quote: 'Where knowledge meets the beauty of Hazratbal.' 
  },
  { 
    url: 'https://nitsri.ac.in/SliderPhoto/2064.jpg', 
    title: 'IT Dept', 
    quote: 'Coding the future, one line at a time.' 
  },
  { 
    url: 'https://nitsri.ac.in/SliderPhoto/3665.jpg', 
    title: 'CSE Dept', 
    quote: 'Turning complex logic into simple solutions.' 
  },
  { 
    url: 'https://nitsri.ac.in/SliderPhoto/4860.jpg', 
    title: 'Mech Dept', 
    quote: 'Designing the machines that move our world.' 
  },
  { 
    url: 'https://nitsri.ac.in/SliderPhoto/3225.jpg', 
    title: 'Electrical Dept', 
    quote: 'Powering innovation across the valley.' 
  },
  { 
    url: 'https://nitsri.ac.in/SliderPhoto/3189.jpg', 
    title: 'Civil Dept', 
    quote: 'Building strong foundations for tomorrow.' 
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Slideshow Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Carousel 
          className="w-full h-full"
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="h-[70vh] -ml-0">
            {HERO_SLIDES.map((slide, index) => (
              <CarouselItem key={index} className="pl-0 relative h-full w-full">
                <div className="relative h-full w-full">
                  <Image 
                    src={slide.url} 
                    alt={slide.title}
                    fill
                    className="object-cover opacity-60"
                    priority={index === 0}
                    data-ai-hint="college campus"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
                  <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
                    <div className="max-w-xl space-y-4 animate-in fade-in slide-in-from-left-5 duration-700">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/30">
                        <GraduationCap className="h-3 w-3" /> {slide.title}
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight text-white">
                        {slide.quote}
                      </h1>
                      <p className="text-sm md:text-base text-muted-foreground font-medium max-w-sm">
                        Access shared notes, papers, and help from fellow students.
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2 bg-card/60 backdrop-blur-md p-2 rounded-xl border border-primary/10 max-w-md mt-6">
                        <div className="flex-grow flex items-center gap-2 px-3">
                          <Search className="h-4 w-4 text-primary" />
                          <input 
                            placeholder="Search subjects..." 
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/50 text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Button asChild size="sm" className="rounded-lg px-6 h-10 font-bold">
                          <Link href={`/browse?search=${searchQuery}`}>Go</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-6 right-12 flex gap-2 z-20">
            <CarouselPrevious className="relative left-0 translate-y-0 h-10 w-10 bg-background/50 hover:bg-primary hover:text-white border-primary/20" />
            <CarouselNext className="relative right-0 translate-y-0 h-10 w-10 bg-background/50 hover:bg-primary hover:text-white border-primary/20" />
          </div>
        </Carousel>
      </section>

      {/* Stats - Compact */}
      <section className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Materials', value: '5,000+', icon: FileText },
            { label: 'Students', value: '12,000+', icon: Users },
            { label: 'Downloads', value: '150,000+', icon: Download },
          ].map((stat, i) => (
            <div key={i} className="bg-card/80 backdrop-blur-md p-4 rounded-xl flex items-center gap-4 border border-primary/10 shadow-xl hover:border-primary/40 transition-all group">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="container mx-auto px-4 space-y-6">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Pick Your Branch</h2>
            <p className="text-muted-foreground text-xs font-medium">Find specific notes for your department.</p>
          </div>
          <Button variant="ghost" asChild className="rounded-full text-xs font-bold text-primary">
            <Link href="/browse">See All <ArrowRight className="ml-2 h-3 w-3" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || BookOpen;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="group hover:bg-primary transition-all duration-300 cursor-pointer rounded-xl overflow-hidden border-primary/5 bg-secondary/20">
                  <CardContent className="flex flex-col items-center justify-center p-6 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-primary/5 group-hover:bg-white/20 transition-colors">
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

      {/* AI Help */}
      <section className="bg-primary/5 py-16 border-y border-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <Badge className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">AI Tools</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">Study Smarter.</h2>
              <p className="text-base text-muted-foreground font-medium">
                Our AI buddy helps you learn faster by making summaries and mock tests from your notes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Summarizer', desc: 'Get main points fast.', icon: Sparkles },
                  { title: 'Mock Tests', desc: 'Practice for exams.', icon: Cpu },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-background border border-primary/5 shadow-sm">
                    <div className="h-8 w-8 bg-primary/5 rounded-lg flex items-center justify-center text-primary shrink-0"><item.icon className="h-4 w-4" /></div>
                    <div>
                      <p className="font-bold text-xs">{item.title}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="rounded-xl px-8 h-12 font-bold mt-2">
                <Link href="/browse">Try It Now</Link>
              </Button>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border-4 border-primary/5 group">
              <Image 
                src="https://media.istockphoto.com/id/692132510/photo/programming-code-abstract-screen-of-software-developer-computer-code-development.jpg?s=170667a&w=0&k=20&c=Nmn8TQ7YHr-juDqb4_lglRZDePrXJI2qB5nC3OXuSV0=" 
                alt="AI Help" 
                fill 
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="container mx-auto px-4">
        <div className="bg-primary rounded-[2rem] p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-6 -left-6 opacity-10">
            <Heart className="h-32 w-32 text-white" />
          </div>
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Help Your Friends.</h2>
            <p className="text-base md:text-lg text-white/90 font-medium leading-relaxed">
              Sharing is caring! Your notes could be exactly what someone else needs to succeed.
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-xl px-10 h-14 font-bold bg-white text-primary hover:scale-105 transition-transform">
              <Link href="/upload">Upload Your Notes</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
