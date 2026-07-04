
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
  FileText, Download, Code, Cpu, Hammer, Droplets, Zap, Beaker, Building2, Microscope, Camera, Heart
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
  { url: 'https://nitsri.ac.in/upload/slide-1-new.jpg', title: 'Main Campus', desc: 'NIT Srinagar Hazratbal' },
  { url: 'https://nitsri.ac.in/SliderPhoto/2064.jpg', title: 'IT Building', desc: 'Where we code' },
  { url: 'https://nitsri.ac.in/SliderPhoto/3665.jpg', title: 'Computer Labs', desc: 'Modern facilities' },
  { url: 'https://nitsri.ac.in/SliderPhoto/4860.jpg', title: 'Mechanical Labs', desc: 'Hands-on learning' },
  { url: 'https://nitsri.ac.in/SliderPhoto/3225.jpg', title: 'Electrical Building', desc: 'Department of Electrical' },
  { url: 'https://nitsri.ac.in/SliderPhoto/3189.jpg', title: 'Civil Building', desc: 'Department of Civil' },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://nitsri.ac.in/upload/slide-1-new.jpg" 
            alt="NIT Srinagar"
            fill
            className="object-cover opacity-20"
            priority
            data-ai-hint="college campus"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-left-5 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30">
              <GraduationCap className="h-4 w-4" /> NIT Srinagar Student Hub
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-tight">
              Study Smarter, <br /><span className="text-primary">Together.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl font-medium">
              Find notes, old papers, and assignments shared by your fellow students. Everything you need for your exams is right here.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 bg-card/40 backdrop-blur-xl p-3 rounded-2xl border border-primary/10 max-w-2xl mt-8">
              <div className="flex-grow flex items-center gap-2 px-3">
                <Search className="h-5 w-5 text-primary" />
                <input 
                  placeholder="Search for subjects or notes..." 
                  className="bg-transparent border-none outline-none text-lg w-full placeholder:text-muted-foreground/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button asChild size="lg" className="rounded-xl px-8 h-14 font-bold">
                <Link href={`/browse?search=${searchQuery}`}>Search Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Gallery */}
      <section className="container mx-auto px-4 space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Our Beautiful Campus</h2>
          <p className="text-muted-foreground">Photos of our college and departments at NIT Srinagar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CAMPUS_IMAGES.map((img, i) => (
            <div key={i} className="group relative aspect-[16/10] rounded-3xl overflow-hidden shadow-lg border border-primary/5">
              <Image 
                src={img.url} 
                alt={img.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-lg font-bold text-white">{img.title}</p>
                <p className="text-sm text-white/70">{img.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Study Materials', value: '5,000+', icon: FileText },
            { label: 'Student Users', value: '12,000+', icon: Users },
            { label: 'Total Downloads', value: '150,000+', icon: Download },
          ].map((stat, i) => (
            <div key={i} className="bg-secondary/20 p-6 rounded-2xl flex items-center gap-6 border border-primary/5 hover:border-primary/20 transition-all">
              <div className="h-14 w-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <stat.icon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="container mx-auto px-4 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Browse by Department</h2>
            <p className="text-muted-foreground text-sm">Find notes specifically for your branch.</p>
          </div>
          <Button variant="outline" asChild className="rounded-full font-bold border-primary/20">
            <Link href="/browse">See Everything <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || BookOpen;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="group hover:bg-primary transition-all duration-300 cursor-pointer rounded-2xl overflow-hidden border-primary/10 bg-secondary/10">
                  <CardContent className="flex flex-col items-center justify-center p-8 gap-4 text-center">
                    <div className="p-4 rounded-xl bg-primary/5 group-hover:bg-white/20 transition-colors">
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

      {/* AI Help */}
      <section className="bg-primary/5 py-24 border-y border-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Badge className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Smart Study Tools</Badge>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-primary">AI Study Helper.</h2>
              <p className="text-lg text-muted-foreground font-medium">
                Our AI helps you learn faster. Turn long notes into short summaries or get practice questions in seconds.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Quick Summaries', desc: 'Get the main points fast.', icon: Sparkles },
                  { title: 'Exam Predictor', desc: 'Practice with real questions.', icon: Cpu },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-background border border-primary/10 shadow-sm">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0"><item.icon className="h-5 w-5" /></div>
                    <div>
                      <p className="font-bold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="rounded-xl px-10 h-16 text-lg font-bold mt-4">
                <Link href="/browse">Try AI Tools <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/10">
              <Image 
                src="https://media.istockphoto.com/id/692132510/photo/programming-code-abstract-screen-of-software-developer-computer-code-development.jpg?s=170667a&w=0&k=20&c=Nmn8TQ7YHr-juDqb4_lglRZDePrXJI2qB5nC3OXuSV0=" 
                alt="AI Help" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Simplified CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-10 -left-10 opacity-10">
            <Heart className="h-64 w-64 text-white" />
          </div>
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tight">Help Your Friends.</h2>
            <p className="text-lg md:text-2xl text-white/90 font-medium leading-relaxed">
              Your notes can help someone else pass their exams. Upload your study materials and be a hero at NIT Srinagar!
            </p>
            <Button asChild size="lg" variant="secondary" className="rounded-2xl px-12 h-16 text-xl font-bold hover:scale-105 transition-transform bg-white text-primary">
              <Link href="/upload">Upload Your Notes Now</Link>
            </Button>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <GraduationCap className="h-64 w-64 text-white" />
          </div>
        </div>
      </section>
    </div>
  );
}
