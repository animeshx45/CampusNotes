
"use client";

import { useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { BRANCHES, MOCK_MATERIALS, SEMESTERS } from '@/lib/mock-data';
import { StudyMaterial } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, Download, FileText, ArrowRight,
  Filter, X, GraduationCap, Video
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const BRANCH_SLIDES: Record<string, { url: string; title: string; hint: string }[]> = {
  'all': [
    { url: 'https://nitsri.ac.in/upload/slide-1-new.jpg', title: 'Main Campus', hint: 'university campus' },
    { url: 'https://picsum.photos/seed/nitsri1/1200/600', title: 'Library Block', hint: 'academic building' },
    { url: 'https://picsum.photos/seed/nitsri2/1200/600', title: 'Green Campus', hint: 'campus trees' },
  ],
  'Information Technology': [
    { url: 'https://nitsri.ac.in/SliderPhoto/2064.jpg', title: 'IT Block', hint: 'it department' },
    { url: 'https://picsum.photos/seed/it1/1200/600', title: 'Innovation Lab', hint: 'coding lab' },
  ],
  'Computer Science & Engineering': [
    { url: 'https://nitsri.ac.in/SliderPhoto/3665.jpg', title: 'CSE Dept', hint: 'computer lab' },
    { url: 'https://picsum.photos/seed/cse1/1200/600', title: 'Server Room', hint: 'technology center' },
  ],
  'Electrical Engineering': [
    { url: 'https://nitsri.ac.in/SliderPhoto/3225.jpg', title: 'Electrical Lab', hint: 'power engineering' },
    { url: 'https://picsum.photos/seed/ee1/1200/600', title: 'Control Systems', hint: 'electrical circuits' },
  ],
  'Mechanical Engineering': [
    { url: 'https://nitsri.ac.in/SliderPhoto/4860.jpg', title: 'Workshop', hint: 'mechanical workshop' },
    { url: 'https://picsum.photos/seed/me1/1200/600', title: 'Design Lab', hint: 'mechanical engine' },
  ],
  'Chemical Engineering': [
    { url: 'https://nitsri.ac.in/SliderPhoto/3428.jpeg', title: 'Chemical Dept', hint: 'chemical laboratory' },
    { url: 'https://picsum.photos/seed/chem1/1200/600', title: 'Process Control', hint: 'chemistry lab' },
  ],
  'Civil Engineering': [
    { url: 'https://nitsri.ac.in/SliderPhoto/3189.jpg', title: 'Civil Block', hint: 'civil construction' },
    { url: 'https://picsum.photos/seed/civil1/1200/600', title: 'Geotech Lab', hint: 'building site' },
  ],
  'Electronics & Communication Engineering': [
    { url: 'https://nitsri.ac.in/SliderPhoto/3474.jpg', title: 'ECE Labs', hint: 'electronics lab' },
    { url: 'https://picsum.photos/seed/ece1/1200/600', title: 'Signals Lab', hint: 'circuit board' },
  ],
  'Metallurgical & Materials Engineering': [
    { url: 'https://nitsri.ac.in/upload/department/met.jpg', title: 'Metallurgy Dept', hint: 'metallurgy lab' },
    { url: 'https://picsum.photos/seed/met1/1200/600', title: 'Material Testing', hint: 'microscope testing' },
  ],
};

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const db = useFirestore();
  
  const [selectedBranch, setSelectedBranch] = useState<string>(searchParams.get('branch') || 'all');
  const [selectedSemester, setSelectedSemester] = useState<string>(searchParams.get('semester') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const materialQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'studyMaterials'));
  }, [db]);

  const { data: dbMaterials, isLoading } = useCollection<StudyMaterial>(materialQuery);

  const filteredMaterials = useMemo(() => {
    const combined = [...MOCK_MATERIALS, ...(dbMaterials || [])];
    
    return combined.filter(m => {
      const branchMatch = selectedBranch === 'all' || m.branch === selectedBranch;
      const semMatch = selectedSemester === 'all' || m.semester.toString() === selectedSemester;
      const searchMatch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.description.toLowerCase().includes(searchQuery.toLowerCase());
      return branchMatch && semMatch && searchMatch;
    });
  }, [selectedBranch, selectedSemester, searchQuery, dbMaterials]);

  const activeSlides = useMemo(() => {
    return BRANCH_SLIDES[selectedBranch] || BRANCH_SLIDES['all'];
  }, [selectedBranch]);

  const resetFilters = () => {
    setSelectedBranch('all');
    setSelectedSemester('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Immersive Department Carousel Header */}
      <section className="relative h-[450px] w-full overflow-hidden">
        <Carousel 
          className="w-full h-full"
          plugins={[autoplayPlugin.current]}
          opts={{ loop: true }}
        >
          <CarouselContent className="h-[450px] -ml-0">
            {activeSlides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0 relative h-full w-full">
                <div className="relative h-full w-full">
                  <Image 
                    src={slide.url} 
                    alt={slide.title}
                    fill
                    className="object-cover opacity-95 brightness-110"
                    priority={index === 0}
                    data-ai-hint={slide.hint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent" />
                  
                  <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-20 space-y-6">
                    <Badge className="bg-primary text-white w-fit rounded-full px-5 py-1.5 animate-in fade-in slide-in-from-left-4 duration-500 font-black tracking-widest text-[11px] shadow-lg">
                      {selectedBranch === 'all' ? 'CENTRAL REPOSITORY' : 'BRANCH RESOURCES'}
                    </Badge>
                    <div className="space-y-2">
                      <h1 className="text-6xl md:text-8xl font-headline font-bold text-white tracking-tighter animate-in fade-in slide-in-from-left-6 duration-700 leading-none drop-shadow-2xl">
                        {selectedBranch === 'all' ? 'Knowledge Hub.' : `${selectedBranch}.`}
                      </h1>
                      <p className="text-white text-2xl max-w-2xl font-medium animate-in fade-in slide-in-from-left-8 duration-1000 leading-relaxed drop-shadow-md">
                        Explore academic resources specifically curated for your branch and semester.
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-10 right-10 flex gap-3 z-20">
            <CarouselPrevious className="relative left-0 translate-y-0 h-12 w-12 bg-white/20 backdrop-blur-md hover:bg-primary hover:text-white border-white/30 rounded-2xl transition-all" />
            <CarouselNext className="relative right-0 translate-y-0 h-12 w-12 bg-white/20 backdrop-blur-md hover:bg-primary hover:text-white border-white/30 rounded-2xl transition-all" />
          </div>
        </Carousel>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8">
            <Card className="p-8 rounded-[2.5rem] border-primary/10 shadow-2xl sticky top-24 bg-card/50 backdrop-blur-xl">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-headline font-bold flex items-center gap-2 text-primary"><Filter className="h-5 w-5" /> Filter Vault</h3>
                  {(selectedBranch !== 'all' || selectedSemester !== 'all' || searchQuery) && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="text-primary hover:bg-primary/5 rounded-full px-4 h-8 text-[11px] font-black uppercase">
                      Reset
                    </Button>
                  )}
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Search Keywords</label>
                    <div className="relative group">
                      <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="Subject name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 bg-secondary/30 border-none rounded-2xl h-12 focus-visible:ring-primary font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Select Branch</label>
                    <select 
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full bg-secondary/30 border-none rounded-2xl h-12 px-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                    >
                      <option value="all">All Departments</option>
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Semester Cycle</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant={selectedSemester === 'all' ? 'default' : 'ghost'} 
                        size="sm" 
                        className="rounded-xl h-10 font-bold transition-all"
                        onClick={() => setSelectedSemester('all')}
                      >
                        All
                      </Button>
                      {SEMESTERS.map(sem => (
                        <Button 
                          key={sem}
                          variant={selectedSemester === sem.toString() ? 'default' : 'ghost'} 
                          size="sm" 
                          className="rounded-xl h-10 font-bold transition-all"
                          onClick={() => setSelectedSemester(sem.toString())}
                        >
                          S{sem}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Results Grid */}
          <div className="flex-1 space-y-12">
            {filteredMaterials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredMaterials.map((material) => (
                  <Card key={material.id} className="group hover:shadow-3xl transition-all duration-500 border-primary/5 rounded-[3rem] overflow-hidden flex flex-col bg-card/80 hover:-translate-y-2 border">
                    <CardHeader className="p-10 pb-6">
                      <div className="flex justify-between items-start">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg">
                          {material.type === 'YouTube Playlist' ? <Video className="h-8 w-8" /> : <FileText className="h-8 w-8" />}
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="rounded-full px-4 py-1 border-primary/20 font-bold">Sem {material.semester}</Badge>
                        </div>
                      </div>
                      <CardTitle className="text-3xl font-headline font-bold group-hover:text-primary transition-colors mt-8 leading-tight line-clamp-2">{material.title}</CardTitle>
                      <p className="text-sm font-bold text-muted-foreground mt-3 flex items-center gap-2 opacity-70">
                        <GraduationCap className="h-4 w-4" /> {material.branch}
                      </p>
                    </CardHeader>
                    <CardContent className="px-10 pb-10 flex-grow space-y-8">
                      <p className="text-muted-foreground leading-relaxed text-base line-clamp-3">{material.description}</p>
                      
                      <div className="flex items-center justify-between pt-8 border-t border-primary/5">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">Contributor</span>
                          <span className="text-base font-bold text-foreground">{material.author}</span>
                        </div>
                        <div className="flex items-center gap-5 text-muted-foreground">
                           <div className="flex items-center gap-2"><Download className="h-5 w-5" /> <span className="text-sm font-black">{material.downloadCount || 0}</span></div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-0 border-t border-primary/5">
                      <Button className="w-full h-20 rounded-none font-black text-xl bg-primary hover:bg-primary/90 transition-all gap-3" asChild>
                        <Link href={`/material/${material.id}`}>
                          Access Repository <ArrowRight className="h-7 w-7 group-hover:translate-x-2 transition-transform" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-40 flex flex-col items-center justify-center text-center gap-10 bg-secondary/10 rounded-[4rem] border-2 border-dashed border-primary/20 animate-in fade-in duration-500">
                <div className="h-32 w-32 bg-primary/10 rounded-full flex items-center justify-center text-primary/40 relative">
                  <Search className="h-16 w-16" />
                  <div className="absolute -top-2 -right-2 h-10 w-10 bg-background rounded-full border border-primary/20 flex items-center justify-center shadow-xl">
                    <X className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-headline font-bold">No Resources Found</h3>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">We couldn't find any materials matching your search. Be the first to contribute to this semester's vault!</p>
                </div>
                <Button onClick={resetFilters} className="rounded-2xl px-12 h-16 font-black text-xl shadow-xl shadow-primary/20">Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
