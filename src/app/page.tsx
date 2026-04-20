
"use client";

import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BRANCHES } from '@/lib/mock-data';
import { Globe, Code, Zap, Settings, FlaskConical, Construction, Cpu, Layers, Loader2, Search, Upload } from 'lucide-react';
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
    <div className="flex flex-col gap-16 pb-20">
      <section className="relative h-[600px] flex items-center overflow-hidden bg-primary/5">
        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-primary">
              Your <span className="text-accent underline underline-offset-8 italic">CampusNotes</span> for NIT Excellence.
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              The premier repository for notes and papers tailored specifically for NIT Srinagar engineering curricula.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-8 shadow-lg">
                <Link href="/browse">Explore Materials</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/upload">Contribute Notes</Link>
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4 border-t border-muted">
              <div>
                <span className="block text-2xl font-bold text-primary">
                  {materialsLoading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : stats.resources}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-bold">Resources</span>
              </div>
              <div className="w-px h-10 bg-muted" />
              <div>
                <span className="block text-2xl font-bold text-primary">
                  {usersLoading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : stats.students}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-bold">Students</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
             <div className="relative aspect-square max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-secondary p-3 rounded-2xl"><Search className="text-primary" /></div>
                  <div><p className="text-xs font-bold uppercase text-muted-foreground">Quick Find</p><p className="font-bold">Latest CSE Papers</p></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-secondary rounded-full" />
                  <div className="h-4 w-3/4 bg-secondary rounded-full" />
                  <div className="h-4 w-5/6 bg-secondary rounded-full" />
                </div>
             </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">Browse by Department</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || Globe;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="hover:shadow-xl hover:border-accent/50 transition-all group cursor-pointer h-full border-none shadow-sm bg-white">
                  <CardContent className="flex flex-col items-center justify-center p-8 gap-4 text-center">
                    <div className="p-4 rounded-2xl bg-secondary group-hover:bg-accent group-hover:text-white transition-all">
                      <Icon className="h-8 w-8 text-primary group-hover:text-white" />
                    </div>
                    <span className="font-bold text-primary group-hover:text-accent leading-tight">{branch}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
