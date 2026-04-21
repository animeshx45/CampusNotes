
"use client";

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BRANCHES } from '@/lib/mock-data';
import { Globe, Code, Zap, Settings, FlaskConical, Construction, Cpu, Layers, Loader2, Search, ArrowRight } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

const BRANCH_ICONS: Record<string, any> = {
  'Information Technology': Globe,
  'Computer Science & Engineering': Code,
  'Electrical Engineering': Zap,
  'Mechanical Engineering': Settings,
  'Chemical Engineering': FlaskConical,
  'Civil Engineering': Construction,
  'Electronics & Communication Engineering': Cpu,
  'Metallurgical & Materials Engineering': Layers
};

export default function Home() {
  const db = useFirestore();

  const materialsQuery = useMemoFirebase(() => db ? collection(db, 'studyMaterials') : null, [db]);
  const usersQuery = useMemoFirebase(() => db ? collection(db, 'users') : null, [db]);

  const { data: materials, isLoading: materialsLoading } = useCollection(materialsQuery);
  const { data: users, isLoading: usersLoading } = useCollection(usersQuery);

  const stats = useMemo(() => ({
    resources: materials?.length || 0,
    students: users?.length || 0
  }), [materials, users]);

  return (
    <div className="flex flex-col gap-24 pb-20 bg-background transition-colors duration-300">
      <section className="relative min-h-[600px] flex items-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now Live for all 8 Departments
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-foreground">
              Your <span className="text-primary underline underline-offset-8 italic">CampusNotes</span> for NIT Excellence.
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              The premier repository for notes and papers tailored specifically for NIT Srinagar engineering curricula.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20 h-14 text-lg">
                <Link href="/browse">Explore Materials</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg border-primary/20 hover:bg-primary/5">
                <Link href="/upload">Contribute Notes</Link>
              </Button>
            </div>
            <div className="flex items-center gap-10 pt-8 border-t border-border">
              <div>
                <span className="block text-3xl font-bold text-primary">
                  {materialsLoading ? <Loader2 className="h-5 w-5 animate-spin inline" /> : stats.resources}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-black tracking-tighter">Resources Shared</span>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <span className="block text-3xl font-bold text-primary">
                  {usersLoading ? <Loader2 className="h-5 w-5 animate-spin inline" /> : stats.students}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-black tracking-tighter">Active Students</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
             <div className="relative aspect-square max-w-md mx-auto bg-card rounded-[2.5rem] shadow-2xl p-10 border border-border/50 overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <Layers className="w-48 h-48 text-primary" />
                </div>
                <div className="relative z-10 flex items-center gap-4 mb-8">
                  <div className="bg-primary/10 p-4 rounded-2xl"><Search className="text-primary w-6 h-6" /></div>
                  <div><p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Quick Search</p><p className="font-headline text-xl font-bold">Latest CSE Papers</p></div>
                </div>
                <div className="space-y-6">
                  <div className="h-4 w-full bg-muted rounded-full animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded-full animate-pulse delay-75" />
                  <div className="h-4 w-5/6 bg-muted rounded-full animate-pulse delay-150" />
                  <div className="pt-6">
                    <Button variant="ghost" className="p-0 text-primary hover:text-primary/80 group">
                      View all results <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-foreground">Browse by Department</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Access specialized resources curated for each of NIT Srinagar's premier engineering branches.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || Globe;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-border/50 bg-card cursor-pointer h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="flex flex-col items-center justify-center p-10 gap-6 text-center relative z-10">
                    <div className="p-5 rounded-3xl bg-secondary group-hover:bg-primary transition-all duration-300 scale-100 group-hover:scale-110 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20">
                      <Icon className="h-10 w-10 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <span className="block font-headline font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors">
                        {branch}
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">View Resources</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary border-none text-primary-foreground rounded-[3rem] p-12 overflow-hidden relative shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Cpu className="w-64 h-64" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">Ready to contribute to the community?</h2>
            <p className="text-lg text-primary-foreground/80 leading-relaxed">Join hundreds of NITians sharing their knowledge. Your notes could be the key to someone else's success.</p>
            <div className="flex gap-4 pt-4">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8 font-bold h-14">
                <Link href="/upload">Upload Material Now</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
