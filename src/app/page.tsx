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
      <section className="relative h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://nitsri.ac.in/upload/slide-1-new.jpg" 
            alt="NIT Srinagar Campus"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(22,163,74,0.1),transparent)]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest border border-primary/20">
              <GraduationCap className="h-4 w-4" /> NIT Srinagar Student Resource Hub
            </div>
            <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter">
              Learn Better, <br /><span className="text-primary italic">Together.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl">
              Access the largest peer-to-peer repository of notes, papers, and AI-powered study tools tailored for NIT Srinagar engineering branches.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 bg-card/50 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-2xl border border-primary/10 max-w-2xl mt-8">
              <div className="flex-grow flex items-center gap-3 px-4">
                <Search className="h-5 w-5 text-primary" />
                <Input 
                  placeholder="Search for subjects or topics..." 
                  className="border-none shadow-none focus-visible:ring-0 text-lg h-auto py-0 font-medium bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button asChild size="lg" className="rounded-2xl px-10 h-16 text-lg font-bold shadow-xl shadow-primary/30">
                <Link href={`/browse?search=${searchQuery}`}>Search Vault</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Total Resources', value: '5,000+', icon: FileText },
            { label: 'Students Helped', value: '12,000+', icon: Users },
            { label: 'Monthly Downloads', value: '50,000+', icon: Download },
          ].map((stat, i) => (
            <div key={i} className="bg-secondary/20 p-8 rounded-[2.5rem] flex items-center gap-6 border border-primary/5 hover:border-primary/20 transition-colors">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <stat.icon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-3xl font-black text-primary">{stat.value}</p>
                <p className="text-muted-foreground font-bold">{stat.label}</p>
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
            <p className="text-muted-foreground text-lg">Browse curated study materials for your specific department.</p>
          </div>
          <Button variant="outline" asChild className="rounded-full px-8 h-12 border-primary/20 hover:bg-primary/5">
            <Link href="/browse">View All Resources <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || BookOpen;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="group hover:border-primary/50 transition-all duration-500 cursor-pointer h-full rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl border-primary/5 bg-secondary/10">
                  <CardContent className="flex flex-col items-center justify-center p-8 gap-6 text-center">
                    <div className="p-5 rounded-3xl bg-primary/5 group-hover:bg-primary transition-all duration-500 group-hover:scale-110 shadow-inner">
                      <Icon className="h-10 w-10 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <span className="font-bold text-base block leading-tight group-hover:text-primary transition-colors">{branch}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* AI Features Section */}
      <section className="bg-primary/[0.03] py-24 border-y border-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <Badge className="bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-accent/20">NEXT-GEN LEARNING</Badge>
              <h2 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter text-primary">AI Study Engine <br /> At Your Fingertips.</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Turn any note into a revision summary or mock exam questions in seconds. Our AI understands the NIT Srinagar curriculum.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: 'Instant Summaries', desc: 'From long lecture notes.', icon: Sparkles },
                  { title: 'Peer-Reviewed', desc: 'Accuracy for exams.', icon: Users },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-background/50 border border-primary/5">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><item.icon className="h-5 w-5" /></div>
                    <div>
                      <p className="font-bold text-primary">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button asChild size="lg" className="rounded-2xl px-12 h-16 text-xl font-bold shadow-2xl shadow-primary/30 mt-4 group">
                <Link href="/browse">Try AI Tools Now <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" /></Link>
              </Button>
            </div>
            <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl border-4 border-primary/10 group">
              <Image 
                src="https://picsum.photos/seed/ai-academic/1000/1000" 
                alt="AI Academic Engine" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <Card className="bg-primary border-none text-primary-foreground rounded-[3.5rem] p-12 md:p-24 overflow-hidden relative shadow-2xl shadow-primary/40 group">
          <div className="relative z-10 max-w-3xl space-y-8">
            <h2 className="text-5xl md:text-8xl font-bold leading-[0.8] tracking-tighter">Share your <br /> knowledge.</h2>
            <p className="text-2xl opacity-90 max-w-xl font-medium">Contribute your notes and help fellow NITians excel in their academics. Your one upload helps thousands.</p>
            <Button asChild size="lg" variant="secondary" className="rounded-2xl px-12 h-18 text-2xl font-black hover:scale-105 transition-transform shadow-2xl bg-white text-primary hover:bg-white/90">
              <Link href="/upload">Upload Material Now</Link>
            </Button>
          </div>
          <div className="absolute right-0 bottom-0 p-12 opacity-10 hidden lg:block group-hover:scale-110 transition-transform duration-1000">
            <GraduationCap className="h-[500px] w-[500px]" />
          </div>
        </Card>
      </section>
    </div>
  );
}