
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BRANCHES } from '@/lib/mock-data';
import { 
  Search, BookOpen, Users, Sparkles, ArrowRight, GraduationCap, 
  FileText, Download, Code, Cpu, Hammer, Droplets, Zap, Beaker, Building2, Microscope, Camera
} from 'lucide-react';
import Image from 'next/image';

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

const CAMPUS_IMAGES = [
  { url: 'https://nitsri.ac.in/upload/slide-1-new.jpg', title: 'Main Campus', desc: 'Hazratbal, Srinagar' },
  { url: 'https://nitsri.ac.in/SliderPhoto/2064.jpg', title: 'IT Dept', desc: 'Innovation Hub' },
  { url: 'https://nitsri.ac.in/SliderPhoto/3665.jpg', title: 'CSE Labs', desc: 'Computing Excellence' },
  { url: 'https://nitsri.ac.in/SliderPhoto/4860.jpg', title: 'ME Labs', desc: 'Mechanical Engineering' },
  { url: 'https://nitsri.ac.in/SliderPhoto/3225.jpg', title: 'EE Building', desc: 'Electrical Sciences' },
  { url: 'https://nitsri.ac.in/SliderPhoto/3189.jpg', title: 'Civil Dept', desc: 'Civil Engineering' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://nitsri.ac.in/upload/slide-1-new.jpg" 
            alt="NIT Srinagar Campus"
            fill
            className="object-cover opacity-30"
            priority
            data-ai-hint="university campus"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(22,163,74,0.15),transparent)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest border border-primary/30 backdrop-blur-md">
              <GraduationCap className="h-4 w-4" /> NIT Srinagar Student Resource Hub
            </div>
            <h1 className="text-6xl md:text-9xl font-bold leading-[0.85] tracking-tighter">
              Empowering <br /><span className="text-primary italic">NITians.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed">
              Access the largest peer-to-peer repository of notes, papers, and AI-powered study tools strictly tailored for our engineering curricula.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 bg-card/60 backdrop-blur-2xl p-4 rounded-[2.5rem] shadow-2xl border border-primary/20 max-w-3xl mt-8">
              <div className="flex-grow flex items-center gap-3 px-4">
                <Search className="h-6 w-6 text-primary" />
                <Input 
                  placeholder="Search subjects, topics, or faculty notes..." 
                  className="border-none shadow-none focus-visible:ring-0 text-xl h-auto py-2 font-medium bg-transparent placeholder:text-muted-foreground/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button asChild size="lg" className="rounded-2xl px-12 h-16 text-xl font-bold shadow-xl shadow-primary/40 hover:scale-[1.02] transition-transform">
                <Link href={`/browse?search=${searchQuery}`}>Search Vault</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Showcase Gallery */}
      <section className="container mx-auto px-4 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <Badge className="bg-primary/20 text-primary border-none rounded-full px-4 py-1">CAMPUS SHOWCASE</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Life at NIT Srinagar</h2>
            <p className="text-muted-foreground text-lg">Glimpses of our vibrant academic community and state-of-the-art facilities.</p>
          </div>
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <Camera className="h-6 w-6" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAMPUS_IMAGES.map((img, i) => (
            <div key={i} className="group relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-xl border border-primary/10">
              <Image 
                src={img.url} 
                alt={img.title} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                data-ai-hint="college campus"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <p className="text-xl font-bold text-primary">{img.title}</p>
                <p className="text-sm text-white font-medium">{img.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Academic Resources', value: '5,000+', icon: FileText },
            { label: 'Verified Students', value: '12,000+', icon: Users },
            { label: 'Resource Accesses', value: '150,000+', icon: Download },
          ].map((stat, i) => (
            <div key={i} className="bg-secondary/20 p-8 rounded-[3rem] flex items-center gap-8 border border-primary/5 hover:border-primary/20 transition-all group">
              <div className="h-20 w-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-inner">
                <stat.icon className="h-10 w-10" />
              </div>
              <div>
                <p className="text-4xl font-black text-primary leading-none mb-2">{stat.value}</p>
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Departments Grid */}
      <section className="container mx-auto px-4 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <Badge className="bg-primary/20 text-primary border-none rounded-full px-4 py-1">DEPARTMENTS</Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Academic Branches</h2>
            <p className="text-muted-foreground text-lg">Specialized notes and papers for all 8 engineering departments.</p>
          </div>
          <Button variant="outline" asChild className="rounded-full px-8 h-12 border-primary/20 hover:bg-primary/5 font-bold">
            <Link href="/browse">View All Resources <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || BookOpen;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="group hover:border-primary/50 transition-all duration-500 cursor-pointer h-full rounded-[3rem] overflow-hidden shadow-lg border-primary/5 bg-secondary/10 hover:-translate-y-2">
                  <CardContent className="flex flex-col items-center justify-center p-10 gap-6 text-center">
                    <div className="p-6 rounded-[2rem] bg-primary/5 group-hover:bg-primary transition-all duration-500 shadow-inner">
                      <Icon className="h-12 w-12 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <span className="font-bold text-lg block leading-tight group-hover:text-primary transition-colors">{branch}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Features Section */}
      <section className="bg-primary/[0.03] py-32 border-y border-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-8">
              <Badge className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl shadow-accent/20">NEXT-GEN LEARNING</Badge>
              <h2 className="text-5xl md:text-8xl font-bold leading-[0.85] tracking-tighter text-primary">AI Revision <br /> Engine.</h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                Transform any peer-shared note into a revision summary or mock examination in seconds. Powered by Gemni and Genkit.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  { title: 'Semantic Summaries', desc: 'Core concepts identified.', icon: Sparkles },
                  { title: 'Exam Predictor', desc: 'Based on NIT patterns.', icon: Cpu },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-3xl bg-background/50 border border-primary/10 shadow-sm">
                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-inner"><item.icon className="h-6 w-6" /></div>
                    <div>
                      <p className="font-bold text-primary text-base">{item.title}</p>
                      <p className="text-xs text-muted-foreground font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="rounded-2xl px-12 h-20 text-2xl font-black shadow-2xl shadow-primary/30 mt-6 group">
                <Link href="/browse">Try AI Study Tools <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform h-6 w-6" /></Link>
              </Button>
            </div>
            <div className="relative aspect-square rounded-[4.5rem] overflow-hidden shadow-2xl border-8 border-primary/10 group">
              <Image 
                src="https://media.istockphoto.com/id/692132510/photo/programming-code-abstract-screen-of-software-developer-computer-code-development.jpg?s=170667a&w=0&k=20&c=Nmn8TQ7YHr-juDqb4_lglRZDePrXJI2qB5nC3OXuSV0=" 
                alt="AI Academic Engine" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                data-ai-hint="ai software code"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12 right-12 p-8 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10">
                 <p className="text-white text-sm font-bold italic opacity-80">"The AI tool helped me compress 40 pages of notes into a 2-page revision guide for mid-sems."</p>
                 <p className="text-primary font-black mt-3 text-xs uppercase tracking-widest">— IT 5th Sem Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <Card className="bg-primary border-none text-primary-foreground rounded-[4rem] p-16 md:p-32 overflow-hidden relative shadow-2xl shadow-primary/50 group">
          <div className="relative z-10 max-w-4xl space-y-10">
            <h2 className="text-6xl md:text-9xl font-bold leading-[0.8] tracking-tighter">Propel the <br /> Community.</h2>
            <p className="text-2xl md:text-3xl opacity-90 max-w-2xl font-bold leading-tight">Your contribution helps thousands. Share your notes and become a legend in the NITian halls.</p>
            <Button asChild size="lg" variant="secondary" className="rounded-2xl px-16 h-20 text-3xl font-black hover:scale-105 transition-transform shadow-2xl bg-white text-primary hover:bg-white/95">
              <Link href="/upload">Upload Material Now</Link>
            </Button>
          </div>
          <div className="absolute right-0 bottom-0 p-16 opacity-10 hidden lg:block group-hover:scale-110 transition-transform duration-1000">
            <GraduationCap className="h-[600px] w-[600px] text-white" />
          </div>
          <div className="absolute top-0 right-0 p-16 opacity-5 hidden lg:block animate-pulse">
            <Zap className="h-64 w-64 text-white fill-current" />
          </div>
        </Card>
      </section>
    </div>
  );
}
