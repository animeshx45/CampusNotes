
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
  FileText, Download, Code, Cpu, Hammer, Droplets, Zap, Beaker, Building2, Microscope
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

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://nitsri.ac.in/upload/slide-1-new.jpg" 
            alt="NIT Srinagar Campus"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
              <GraduationCap className="h-4 w-4" /> NIT Srinagar Student Resource Hub
            </div>
            <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter">
              Learn Better, <br /><span className="text-primary italic">Together.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl">
              Access the largest peer-to-peer repository of notes, papers, and AI-powered study tools tailored for NIT Srinagar engineering branches.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 bg-card p-6 rounded-[2rem] shadow-2xl border border-primary/10 max-w-2xl">
              <div className="flex-grow flex items-center gap-2 px-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search for subjects, topics, or notes..." 
                  className="border-none shadow-none focus-visible:ring-0 text-lg h-auto py-0 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button asChild size="lg" className="rounded-2xl px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20">
                <Link href={`/browse?search=${searchQuery}`}>Search Vault</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-secondary/30 p-8 rounded-[2rem] flex items-center gap-6 border border-primary/5">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <p className="text-3xl font-black text-primary">5,000+</p>
              <p className="text-muted-foreground font-bold">Total Resources</p>
            </div>
          </div>
          <div className="bg-secondary/30 p-8 rounded-[2rem] flex items-center gap-6 border border-primary/5">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Users className="h-8 w-8" />
            </div>
            <div>
              <p className="text-3xl font-black text-primary">12,000+</p>
              <p className="text-muted-foreground font-bold">Students Helped</p>
            </div>
          </div>
          <div className="bg-secondary/30 p-8 rounded-[2rem] flex items-center gap-6 border border-primary/5">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Download className="h-8 w-8" />
            </div>
            <div>
              <p className="text-3xl font-black text-primary">50,000+</p>
              <p className="text-muted-foreground font-bold">Monthly Downloads</p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="container mx-auto px-4 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-4xl font-bold tracking-tight">Academic Branches</h2>
            <p className="text-muted-foreground text-lg">Browse curated study materials for your specific department.</p>
          </div>
          <Button variant="outline" asChild className="rounded-full px-8 border-primary/20">
            <Link href="/browse">View All Resources <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || BookOpen;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer h-full rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl border-primary/5">
                  <CardContent className="flex flex-col items-center justify-center p-8 gap-4 text-center">
                    <div className="p-4 rounded-2xl bg-primary/5 group-hover:bg-primary transition-all duration-300 group-hover:scale-110 shadow-sm">
                      <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <span className="font-bold text-sm block leading-tight">{branch}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Features Section */}
      <section className="bg-primary/5 py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Badge className="bg-accent text-white px-4 py-1 rounded-full text-xs font-bold">NEXT-GEN LEARNING</Badge>
              <h2 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter text-primary">AI Study Engine <br /> At Your Fingertips.</h2>
              <p className="text-xl text-muted-foreground">
                Turn any note into a revision summary or mock exam questions in seconds. Our AI understands the NIT Srinagar curriculum.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"><Sparkles className="h-5 w-5" /></div>
                  <p className="font-bold">Instant Summaries from long lecture notes.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary"><Users className="h-5 w-5" /></div>
                  <p className="font-bold">Peer-reviewed materials for exam accuracy.</p>
                </div>
              </div>
              <Button asChild size="lg" className="rounded-2xl px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20">
                <Link href="/browse">Try AI Tools Now</Link>
              </Button>
            </div>
            <div className="relative aspect-square lg:aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-card">
              <Image 
                src="https://picsum.photos/seed/ai-study/1200/800" 
                alt="AI Study" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <Card className="bg-primary border-none text-primary-foreground rounded-[3rem] p-12 md:p-24 overflow-hidden relative shadow-2xl shadow-primary/30 group">
          <div className="relative z-10 max-w-3xl space-y-8">
            <h2 className="text-5xl md:text-8xl font-bold leading-[0.8] tracking-tighter">Share your <br /> knowledge.</h2>
            <p className="text-2xl opacity-90 max-w-xl">Contribute your notes and help fellow NITians excel in their academics. Your one upload helps thousands.</p>
            <Button asChild size="lg" variant="secondary" className="rounded-2xl px-12 h-16 text-xl font-bold hover:scale-105 transition-transform shadow-2xl">
              <Link href="/upload">Upload Material Now</Link>
            </Button>
          </div>
          <div className="absolute right-0 bottom-0 p-12 opacity-10 hidden lg:block group-hover:scale-110 transition-transform duration-700">
            <GraduationCap className="h-[400px] w-[400px]" />
          </div>
        </Card>
      </section>
    </div>
  );
}
