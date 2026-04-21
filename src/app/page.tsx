
"use client";

import { useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BRANCHES } from '@/lib/mock-data';
import { 
  Globe, Code, Zap, Settings, FlaskConical, Construction, Cpu, Layers, 
  Search, ArrowRight, ChevronLeft, ChevronRight 
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
  { id: 'hero-nitsri-official', title: 'NIT Srinagar Excellence', subtitle: 'Leading the way in engineering and research.' },
  { id: 'branch-electrical-3', title: 'Electrical Engineering', subtitle: 'Powering the future with sustainable energy systems.' },
  { id: 'branch-it-1', title: 'Information Technology', subtitle: 'Empowering digital transformation and network security.' },
  { id: 'branch-cse-1', title: 'Computer Science', subtitle: 'Innovating through algorithms, AI, and data science.' },
  { id: 'branch-mechanical-1', title: 'Mechanical Engineering', subtitle: 'Designing tomorrow\'s advanced robotics and machines.' },
  { id: 'branch-ece-1', title: 'Electronics & Comm.', subtitle: 'Mastering the signals that connect our global world.' },
  { id: 'branch-civil-1', title: 'Civil Engineering', subtitle: 'Constructing resilient and modern infrastructure.' },
  { id: 'branch-chemical-1', title: 'Chemical Engineering', subtitle: 'Advancing industrial processes and chemical research.' },
  { id: 'branch-meta-1', title: 'Metallurgy & Materials', subtitle: 'Developing the fundamental materials of modern tech.' },
  { id: 'hero-campus-3', title: 'Majestic Campus', subtitle: 'Study amidst the beauty of Srinagar\'s mountains.' }
];

export default function Home() {
  const db = useFirestore();
  const [api, setApi] = useState<any>();

  const materialsQuery = useMemoFirebase(() => db ? collection(db, 'studyMaterials') : null, [db]);
  const usersQuery = useMemoFirebase(() => db ? collection(db, 'users') : null, [db]);

  const { data: materials, isLoading: materialsLoading } = useCollection(materialsQuery);
  const { data: users, isLoading: usersLoading } = useCollection(usersQuery);

  const stats = useMemo(() => ({
    resources: (materials?.length || 0) + 12, 
    students: (users?.length || 0) + 150
  }), [materials, users]);

  const getImageData = (id: string) => {
    return placeholderData.placeholderImages.find(img => img.id === id);
  };

  useEffect(() => {
    if (!api) return;
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 6000);
    return () => clearInterval(intervalId);
  }, [api]);

  return (
    <div className="flex flex-col gap-12 md:gap-24 pb-20 bg-background transition-colors duration-300">
      {/* Hero Slideshow Section */}
      <section className="relative w-full h-[500px] md:h-[700px] overflow-hidden">
        <Carousel setApi={setApi} className="w-full h-full" opts={{ loop: true }}>
          <CarouselContent className="h-full -ml-0">
            {SLIDES.map((slide, index) => {
              const imageData = getImageData(slide.id);
              const imageUrl = imageData?.imageUrl || `https://picsum.photos/seed/${slide.id}/1600/800`;
              const isExternal = imageUrl.includes('nitsri.ac.in') || imageUrl.includes('pixabay.com') || imageUrl.includes('cdn.pixabay.com');

              return (
                <CarouselItem key={slide.id} className="relative h-[500px] md:h-[700px] pl-0">
                  <div className="absolute inset-0 z-0">
                    <Image 
                      src={imageUrl} 
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                      sizes="100vw"
                      unoptimized={isExternal}
                      data-ai-hint={imageData?.imageHint || "university architecture"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
                    <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10" />
                  </div>
                  
                  <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-20">
                    <div className="max-w-3xl space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/30 backdrop-blur-md text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-white/20">
                        National Institute of Technology, Srinagar
                      </div>
                      <h1 className="text-3xl md:text-7xl font-headline font-bold leading-tight text-white drop-shadow-2xl">
                        {slide.title}
                      </h1>
                      <p className="text-base md:text-xl text-white/90 max-w-lg leading-relaxed font-medium drop-shadow-lg">
                        {slide.subtitle}
                      </p>
                      <div className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
                        <Button asChild size="lg" className="rounded-full px-6 md:px-8 shadow-xl shadow-primary/20 h-12 md:h-14 text-sm md:text-lg bg-primary hover:bg-primary/90">
                          <Link href="/browse">Access Materials</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="rounded-full px-6 md:px-8 h-12 md:h-14 text-sm md:text-lg bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20">
                          <Link href="/upload">Share Notes</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="hidden md:flex absolute bottom-8 right-8 z-30 flex gap-2">
            <CarouselPrevious className="static translate-y-0 h-12 w-12 rounded-full border-white/20 bg-black/40 text-white hover:bg-primary" />
            <CarouselNext className="static translate-y-0 h-12 w-12 rounded-full border-white/20 bg-black/40 text-white hover:bg-primary" />
          </div>
        </Carousel>

        {/* Floating Stats Overlay */}
        <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none">
          <div className="container mx-auto px-4 pb-6 md:pb-12">
            <div className="bg-background/80 backdrop-blur-xl border border-primary/10 rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-8 max-w-sm md:max-w-lg flex items-center justify-around md:justify-start gap-4 md:gap-10 shadow-2xl pointer-events-auto animate-in fade-in slide-in-from-left duration-700">
              <div className="text-center md:text-left">
                {materialsLoading ? (
                  <div className="h-8 md:h-10 w-16 bg-primary/10 animate-pulse rounded-lg mb-1" />
                ) : (
                  <span className="block text-2xl md:text-4xl font-headline font-bold text-primary">
                    {stats.resources}
                  </span>
                )}
                <span className="text-[9px] md:text-xs text-muted-foreground uppercase font-black tracking-tighter">Verified Resources</span>
              </div>
              <div className="w-px h-8 md:h-12 bg-primary/10" />
              <div className="text-center md:text-left">
                {usersLoading ? (
                  <div className="h-8 md:h-10 w-16 bg-primary/10 animate-pulse rounded-lg mb-1" />
                ) : (
                  <span className="block text-2xl md:text-4xl font-headline font-bold text-primary">
                    {stats.students}
                  </span>
                )}
                <span className="text-[9px] md:text-xs text-muted-foreground uppercase font-black tracking-tighter">Active NITians</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Department Section */}
      <section className="container mx-auto px-4 space-y-8 md:space-y-12">
        <div className="text-center space-y-3 md:space-y-4">
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-foreground">
            Explore <span className="text-primary italic">Departments</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">
            Direct access to specialized academic materials curated for NIT Srinagar's premier engineering curricula.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || Globe;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl md:hover:-translate-y-2 border border-primary/5 bg-card cursor-pointer h-full rounded-[1.5rem] md:rounded-[2.5rem]">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="flex flex-col items-center justify-center p-6 md:p-10 gap-4 md:gap-6 text-center relative z-10">
                    <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-secondary group-hover:bg-primary transition-all duration-500 scale-100 group-hover:rotate-6 shadow-sm group-hover:shadow-lg group-hover:shadow-primary/30">
                      <Icon className="h-8 w-8 md:h-12 md:h-12 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <span className="block font-headline font-bold text-lg md:text-xl text-foreground leading-tight group-hover:text-primary transition-colors">
                        {branch}
                      </span>
                      <div className="flex items-center justify-center gap-1 text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
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
      <section className="container mx-auto px-4 py-8 md:py-16">
        <Card className="bg-primary border-none text-primary-foreground rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 overflow-hidden relative shadow-2xl shadow-primary/30">
          <div className="absolute top-0 right-0 p-12 opacity-10 hidden md:block">
            <Cpu className="w-80 h-80" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-4 md:space-y-8">
            <h2 className="text-3xl md:text-6xl font-headline font-bold leading-tight">
              Empower the community.
            </h2>
            <p className="text-base md:text-xl text-primary-foreground/90 leading-relaxed font-medium">
              Join hundreds of NIT Srinagar students sharing their knowledge. Your contributions make academic excellence accessible to all.
            </p>
            <div className="flex gap-4 pt-2 md:pt-4">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8 md:px-10 font-bold h-12 md:h-16 text-sm md:text-lg hover:scale-[1.05] transition-transform">
                <Link href="/upload">Upload Material</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
