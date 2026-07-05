
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
import placeholderData from "@/app/lib/placeholder-images.json";

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
    const getImg = (id: string) => placeholderData.placeholderImages.find(img => img.id === id);
    const commonSlides = [
      getImg('hero-nitsri-official'),
      { imageUrl: 'https://picsum.photos/seed/nitsri1/1200/600', title: 'Library Block', imageHint: 'academic building' },
      { imageUrl: 'https://picsum.photos/seed/nitsri2/1200/600', title: 'Green Campus', imageHint: 'campus trees' },
    ];

    const branchSlides: Record<string, any[]> = {
      'Information Technology': [
        getImg('it-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/it1/1200/600', title: 'Innovation Lab', imageHint: 'coding lab' },
      ],
      'Computer Science & Engineering': [
        getImg('cse-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/cse1/1200/600', title: 'Server Room', imageHint: 'technology center' },
      ],
      'Electrical Engineering': [
        getImg('ee-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/ee1/1200/600', title: 'Control Systems', imageHint: 'electrical circuits' },
      ],
      'Mechanical Engineering': [
        getImg('mech-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/me1/1200/600', title: 'Design Lab', imageHint: 'mechanical engine' },
      ],
      'Chemical Engineering': [
        getImg('chem-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/chem1/1200/600', title: 'Process Control', imageHint: 'chemistry lab' },
      ],
      'Civil Engineering': [
        getImg('civil-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/civil1/1200/600', title: 'Geotech Lab', imageHint: 'building site' },
      ],
      'Electronics & Communication Engineering': [
        getImg('ece-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/ece1/1200/600', title: 'Signals Lab', imageHint: 'circuit board' },
      ],
      'Metallurgical & Materials Engineering': [
        getImg('meta-dept-official'),
        { imageUrl: 'https://picsum.photos/seed/met1/1200/600', title: 'Material Testing', imageHint: 'microscope testing' },
      ],
    };

    return branchSlides[selectedBranch] || commonSlides;
  }, [selectedBranch]);

  const resetFilters = () => {
    setSelectedBranch('all');
    setSelectedSemester('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Immersive Department Carousel Header */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <Carousel 
          className="w-full h-full"
          plugins={[autoplayPlugin.current]}
          opts={{ loop: true }}
        >
          <CarouselContent className="h-[400px] -ml-0">
            {activeSlides.map((slide, index) => (
              <CarouselItem key={index} className="pl-0 relative h-full w-full">
                <div className="relative h-full w-full">
                  <Image 
                    src={slide.imageUrl || 'https://picsum.photos/seed/fallback/1200/600'} 
                    alt={slide.title || 'Campus Slide'}
                    fill
                    className="object-cover opacity-100 brightness-[1.10]"
                    priority={index === 0}
                    data-ai-hint={slide.imageHint || 'university campus'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-transparent" />
                  
                  <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-end pb-16 space-y-4">
                    <Badge className="bg-primary text-white w-fit rounded-full px-5 py-1.5 animate-in fade-in slide-in-from-left-4 duration-500 font-black tracking-widest text-[11px] shadow-2xl">
                      {selectedBranch === 'all' ? 'CENTRAL REPOSITORY' : 'BRANCH RESOURCES'}
                    </Badge>
                    <div className="space-y-1">
                      <h1 className="text-5xl md:text-6xl font-headline font-bold text-white tracking-tighter animate-in fade-in slide-in-from-left-6 duration-700 leading-tight drop-shadow-2xl">
                        {selectedBranch === 'all' ? 'Knowledge Hub.' : `${selectedBranch}.`}
                      </h1>
                      <p className="text-white/90 text-xl max-w-xl font-medium animate-in fade-in slide-in-from-left-8 duration-1000 leading-relaxed drop-shadow-xl">
                        Explore academic resources specifically curated for your branch and semester.
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-8 right-8 flex gap-3 z-20">
            <CarouselPrevious className="relative left-0 translate-y-0 h-10 w-10 bg-white/10 backdrop-blur-3xl hover:bg-primary hover:text-white border-white/20 rounded-xl transition-all shadow-xl" />
            <CarouselNext className="relative right-0 translate-y-0 h-10 w-10 bg-white/10 backdrop-blur-3xl hover:bg-primary hover:text-white border-white/20 rounded-xl transition-all shadow-xl" />
          </div>
        </Carousel>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8">
            <Card className="p-8 rounded-[2.5rem] border-primary/10 shadow-2xl sticky top-24 bg-card/60 backdrop-blur-2xl">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-headline font-bold flex items-center gap-2 text-primary"><Filter className="h-5 w-5" /> Filter Vault</h3>
                  {(selectedBranch !== 'all' || selectedSemester !== 'all' || searchQuery) && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="text-primary hover:bg-primary/10 rounded-full px-4 h-7 text-[10px] font-black uppercase tracking-wider">
                      Reset
                    </Button>
                  )}
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Search Keywords</label>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                        placeholder="Subject name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 bg-secondary/30 border-none rounded-2xl h-12 focus-visible:ring-1 focus-visible:ring-primary/40 font-medium shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Select Branch</label>
                    <select 
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full bg-secondary/30 border-none rounded-2xl h-12 px-4 text-sm font-bold focus:ring-1 focus:ring-primary/40 outline-none appearance-none cursor-pointer shadow-inner"
                    >
                      <option value="all">All Departments</option>
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Semester Cycle</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant={selectedSemester === 'all' ? 'default' : 'ghost'} 
                        size="sm" 
                        className="rounded-xl h-10 font-bold transition-all shadow-sm"
                        onClick={() => setSelectedSemester('all')}
                      >
                        All
                      </Button>
                      {SEMESTERS.map(sem => (
                        <Button 
                          key={sem}
                          variant={selectedSemester === sem.toString() ? 'default' : 'ghost'} 
                          size="sm" 
                          className="rounded-xl h-10 font-bold transition-all shadow-sm"
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
                  <Card key={material.id} className="group hover:shadow-3xl transition-all duration-500 border-primary/5 rounded-[2.5rem] overflow-hidden flex flex-col bg-card/80 hover:-translate-y-2 border shadow-lg">
                    <CardHeader className="p-8 pb-4">
                      <div className="flex justify-between items-start">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg">
                          {material.type === 'YouTube Playlist' ? <Video className="h-7 w-7" /> : <FileText className="h-7 w-7" />}
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="rounded-full px-4 py-1 border-primary/20 font-bold text-[10px]">Sem {material.semester}</Badge>
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-headline font-bold group-hover:text-primary transition-colors mt-6 leading-tight line-clamp-2">{material.title}</CardTitle>
                      <p className="text-[11px] font-bold text-muted-foreground mt-2 flex items-center gap-2 opacity-70">
                        <GraduationCap className="h-3.5 w-3.5" /> {material.branch}
                      </p>
                    </CardHeader>
                    <CardContent className="px-8 pb-8 flex-grow space-y-6">
                      <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3">{material.description}</p>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground mb-0.5">Contributor</span>
                          <span className="text-sm font-bold text-foreground">{material.author}</span>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                           <div className="flex items-center gap-1.5"><Download className="h-4 w-4" /> <span className="text-xs font-black">{material.downloadCount || 0}</span></div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-0 border-t border-primary/5">
                      <Button className="w-full h-16 rounded-none font-black text-lg bg-primary hover:bg-primary/90 transition-all gap-2" asChild>
                        <Link href={`/material/${material.id}`}>
                          Access Repository <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-40 flex flex-col items-center justify-center text-center gap-8 bg-secondary/10 rounded-[3rem] border-2 border-dashed border-primary/10 animate-in fade-in duration-500 shadow-inner">
                <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center text-primary/40 relative shadow-xl">
                  <Search className="h-12 w-12" />
                  <div className="absolute -top-1 -right-1 h-8 w-8 bg-background rounded-full border border-primary/20 flex items-center justify-center shadow-2xl">
                    <X className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-headline font-bold">No Resources Found</h3>
                  <p className="text-muted-foreground text-base max-w-sm mx-auto leading-relaxed">We couldn't find any materials matching your search. Be the first to contribute!</p>
                </div>
                <Button onClick={resetFilters} className="rounded-2xl px-10 h-14 font-black text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
