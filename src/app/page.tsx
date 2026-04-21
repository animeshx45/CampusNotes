
"use client";

import { useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BRANCHES } from '@/lib/mock-data';
import { 
  Globe, Code, Zap, Settings, FlaskConical, Construction, Cpu, Layers, 
  Loader2, Search, ArrowRight, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import placeholderData from '@/app/lib/placeholder-images.json';

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

const SLIDES = [
  { id: 'hero-campus-1', title: 'NIT Srinagar Excellence', subtitle: 'Building the engineers of tomorrow.' },
  { id: 'branch-it', title: 'Information Technology', subtitle: 'Empowering digital transformation.' },
  { id: 'branch-cse', title: 'Computer Science', subtitle: 'Innovating through algorithms.' },
  { id: 'branch-electrical', title: 'Electrical Engineering', subtitle: 'Powering the future of NIT.' },
  { id: 'branch-mechanical', title: 'Mechanical Engineering', subtitle: 'Designing tomorrow\'s machines.' },
  { id: 'hero-campus-2', title: 'Collaborative Study', subtitle: 'Access peer-verified resources.' }
];

export default function Home() {
  const db = useFirestore();
  const [api, setApi] = useState<any>();

  const materialsQuery = useMemoFirebase(() => db ? collection(db, 'studyMaterials') : null, [db]);
  const usersQuery = useMemoFirebase(() => db ? collection(db, 'users') : null, [db]);

  const { data: materials, isLoading: materialsLoading } = useCollection(materialsQuery);
  const { data: users, isLoading: usersLoading } = useCollection(usersQuery);

  const stats = useMemo(() => ({
    resources: materials?.length || 0,
    students: users?.length || 0
  }), [materials, users]);

  const getImageUrl = (id: string) => {
    return placeholderData.placeholderImages.find(img => img.id === id)?.imageUrl || `https://picsum.photos/seed/${id}/1600/800`;
  };

  useEffect(() => {
    if (!api) return;
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [api]);

  return (
    <div className="flex flex-col gap-24 pb-20 bg-background transition-colors duration-300">
      {/* Hero Slideshow Section */}
      <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
        <Carousel setApi={setApi} className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent className="h-full -ml-0">
            {SLIDES.map((slide) => (
              <CarouselItem key={slide.id} className="relative h-[600px] md:h-[700px] pl-0">
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={getImageUrl(slide.id)} 
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint="university campus engineering"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10" />
                </div>
                
                <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-20">
                  <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md text-primary-foreground text-xs font-bold uppercase tracking-wider border border-primary/30">
                      National Institute of Technology, Srinagar
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white drop-shadow-2xl">
                      {slide.title}
                    </h1>
                    <p className="text-xl text-white/90 max-w-lg leading-relaxed font-medium drop-shadow-lg">
                      {slide.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                      <Button asChild size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20 h-14 text-lg bg-primary hover:bg-primary/90">
                        <Link href="/browse">Get Study Materials</Link>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14 text-lg bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
                        <Link href="/upload">Contribute Notes</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-8 right-8 z-30 flex gap-2">
            <CarouselPrevious className="static translate-y-0 h-12 w-12 rounded-full border-white/20 bg-black/40 text-white hover:bg-primary" />
            <CarouselNext className="static translate-y-0 h-12 w-12 rounded-full border-white/20 bg-black/40 text-white hover:bg-primary" />
          </div>
        </Carousel>

        {/* Floating Stats Overlay */}
        <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none">
          <div className="container mx-auto px-4 pb-12">
            <div className="bg-background/80 backdrop-blur-xl border border-border/50 rounded-[2rem] p-8 max-w-lg flex items-center gap-10 shadow-2xl pointer-events-auto animate-in fade-in slide-in-from-left duration-700">
              <div>
                <span className="block text-4xl font-bold text-primary">
                  {materialsLoading ? <Loader2 className="h-6 w-6 animate-spin inline" /> : stats.resources}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-black tracking-tighter">Resources Shared</span>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <span className="block text-4xl font-bold text-primary">
                  {usersLoading ? <Loader2 className="h-6 w-6 animate-spin inline" /> : stats.students}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-black tracking-tighter">Active Students</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Department Section */}
      <section className="container mx-auto px-4 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Browse by <span className="text-primary italic underline underline-offset-8">Department</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Access specialized resources curated for each of NIT Srinagar's premier engineering branches.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || Globe;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-border/50 bg-card cursor-pointer h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="flex flex-col items-center justify-center p-10 gap-6 text-center relative z-10">
                    <div className="p-6 rounded-3xl bg-secondary group-hover:bg-primary transition-all duration-500 scale-100 group-hover:rotate-6 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/30">
                      <Icon className="h-12 w-12 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div className="space-y-3">
                      <span className="block font-headline font-bold text-xl text-foreground leading-tight group-hover:text-primary transition-colors">
                        {branch}
                      </span>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                        View Resources <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary border-none text-primary-foreground rounded-[3rem] p-12 overflow-hidden relative shadow-2xl shadow-primary/30">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Cpu className="w-80 h-80" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Ready to contribute to the community?
            </h2>
            <p className="text-xl text-primary-foreground/90 leading-relaxed font-medium">
              Join hundreds of NITians sharing their knowledge. Your notes could be the key to someone else's success.
            </p>
            <div className="flex gap-4 pt-4">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-10 font-bold h-16 text-lg hover:scale-105 transition-transform">
                <Link href="/upload">Upload Material Now</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
