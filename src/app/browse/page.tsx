
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BRANCHES, SEMESTERS, MOCK_MATERIALS } from '@/lib/mock-data';
import { DEPARTMENT_REPRESENTATIVES } from '@/lib/department-data';
import { StudyMaterial } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Search, SlidersHorizontal, ArrowRight, Loader2, Mail, Linkedin, 
  FileText, GraduationCap, Clock, Sparkles, Filter, Youtube
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import placeholderData from '@/app/lib/placeholder-images.json';

const BRANCH_IMAGE_MAP: Record<string, string[]> = {
  'Information Technology': ['branch-it-1', 'branch-it-2', 'hero-campus-1'],
  'Computer Science & Engineering': ['branch-cse-1', 'branch-cse-2', 'hero-campus-2'],
  'Electrical Engineering': ['branch-electrical-1', 'branch-electrical-2', 'hero-campus-3'],
  'Mechanical Engineering': ['branch-mechanical-1', 'branch-mechanical-2', 'hero-campus-1'],
  'Chemical Engineering': ['branch-chemical-1', 'branch-chemical-2', 'hero-campus-2'],
  'Civil Engineering': ['branch-civil-1', 'branch-civil-2', 'hero-campus-3'],
  'Electronics & Communication Engineering': ['branch-ece-1', 'branch-ece-2', 'hero-campus-1'],
  'Metallurgical & Materials Engineering': ['branch-meta-1', 'branch-meta-2', 'hero-campus-2']
};

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const db = useFirestore();
  const [api, setApi] = useState<any>();
  
  const [selectedBranch, setSelectedBranch] = useState<string>(searchParams.get('branch') || 'all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const materialsQuery = useMemoFirebase(() => db ? query(collection(db, 'studyMaterials'), orderBy('createdAt', 'desc')) : null, [db]);
  const { data: materials, isLoading } = useCollection<StudyMaterial>(materialsQuery);

  const filteredMaterials = useMemo(() => {
    const combined = [...(materials || []), ...MOCK_MATERIALS];
    
    return combined.filter(m => {
      const branchMatch = selectedBranch === 'all' || m.branch === selectedBranch;
      const semMatch = selectedSemester === 'all' || m.semester.toString() === selectedSemester;
      const searchMatch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.author.toLowerCase().includes(searchQuery.toLowerCase());
      return branchMatch && semMatch && searchMatch;
    });
  }, [selectedBranch, selectedSemester, searchQuery, materials]);

  const selectedReps = useMemo(() => {
    if (selectedBranch === 'all') return [];
    return DEPARTMENT_REPRESENTATIVES.filter(r => r.branch === selectedBranch);
  }, [selectedBranch]);

  const branchSlides = useMemo(() => {
    if (selectedBranch === 'all') return null;
    return BRANCH_IMAGE_MAP[selectedBranch] || ['hero-campus-1', 'hero-campus-2', 'hero-campus-3'];
  }, [selectedBranch]);

  useEffect(() => {
    if (!api) return;
    const intervalId = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [api]);

  const formatDate = (date: any) => {
    if (date instanceof Timestamp) return date.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    if (typeof date === 'string') return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return 'Recently';
  };

  if (isLoading) return (
    <div className="py-32 flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-muted-foreground animate-pulse font-medium">Scanning archives...</p>
    </div>
  );

  const FilterContent = ({ isMobile = false }) => (
    <div className={`space-y-8 ${isMobile ? 'pt-6' : ''}`}>
      {!isMobile && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-headline font-bold text-primary text-lg">
            <SlidersHorizontal className="h-5 w-5" /> Filters
          </div>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary" onClick={() => {setSelectedBranch('all'); setSelectedSemester('all'); setSearchQuery('');}}>
            Reset
          </Button>
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Search Keywords</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="e.g. Thermodynamics..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              className="bg-secondary/50 border-none pl-10 rounded-xl focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Department</label>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="bg-secondary/50 border-none rounded-xl">
              <SelectValue placeholder="All Branches" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Branches</SelectItem>
              {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Semester</label>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="bg-secondary/50 border-none rounded-xl">
              <SelectValue placeholder="All Semesters" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Semesters</SelectItem>
              {SEMESTERS.map(s => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
        <p className="text-xs font-bold text-primary flex items-center gap-2">
          <GraduationCap className="h-4 w-4" /> Academic Tip
        </p>
        <p className="text-[11px] leading-relaxed text-muted-foreground italic">
          "Check out the YouTube Playlists section for structured video courses from top educators."
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden border-b border-primary/10">
        {selectedBranch !== 'all' && branchSlides ? (
          <div className="h-[300px] md:h-[450px] relative">
            <Carousel setApi={setApi} className="w-full h-full" opts={{ loop: true }}>
              <CarouselContent className="h-full -ml-0">
                {branchSlides.map((slideId, index) => {
                  const imageData = placeholderData.placeholderImages.find(img => img.id === slideId);
                  return (
                    <CarouselItem key={slideId} className="relative h-[300px] md:h-[450px] pl-0">
                      <Image 
                        src={imageData?.imageUrl || `https://picsum.photos/seed/${slideId}/1600/800`}
                        alt={selectedBranch}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="100vw"
                        data-ai-hint={imageData?.imageHint || "engineering"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
                      <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10" />
                      
                      <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-20">
                        <div className="max-w-2xl space-y-2 md:space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
                          <Badge className="bg-primary text-white border-none px-3 py-0.5 text-[10px] uppercase tracking-widest font-black rounded-full shadow-lg w-fit">
                            {selectedBranch}
                          </Badge>
                          <h1 className="text-2xl md:text-6xl font-headline font-bold text-white drop-shadow-2xl">
                            {selectedBranch.split(' ')[0]} <span className="text-primary italic">Resource hub</span>
                          </h1>
                          <p className="text-sm md:text-lg text-white/90 font-medium max-w-lg drop-shadow-md">
                            Browse specialized materials curated by your department seniors and representatives.
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <div className="hidden md:flex absolute bottom-6 right-6 z-30 gap-2">
                <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full border-white/20 bg-black/40 text-white hover:bg-primary" />
                <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full border-white/20 bg-black/40 text-white hover:bg-primary" />
              </div>
            </Carousel>
          </div>
        ) : (
          <div className="bg-primary/5 py-8 md:py-16">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-5xl font-headline font-bold text-primary">
                    Resource <span className="text-foreground">Vault</span>
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-lg">
                    Explore thousands of student-verified materials across all NIT Srinagar departments.
                  </p>
                </div>
                <Button asChild size="lg" className="rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform w-full md:w-auto">
                  <Link href="/upload">
                    Share Material <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:hidden flex justify-between items-center mb-4">
             <div className="flex items-center gap-2">
               <Filter className="h-4 w-4 text-primary" />
               <span className="font-bold text-sm">Find Materials</span>
             </div>
             <Sheet>
               <SheetTrigger asChild>
                 <Button variant="outline" size="sm" className="rounded-full border-primary/20">
                   Adjust Filters <SlidersHorizontal className="ml-2 h-3 w-3" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="w-[300px]">
                 <SheetHeader>
                   <SheetTitle>Search Filters</SheetTitle>
                 </SheetHeader>
                 <FilterContent isMobile />
               </SheetContent>
             </Sheet>
          </div>

          <aside className="hidden lg:block w-80 shrink-0">
            <div className="bg-card p-6 rounded-[2rem] border border-primary/10 shadow-xl space-y-8 sticky top-24">
              <FilterContent />
            </div>
          </aside>

          <div className="flex-1 space-y-8">
            {selectedReps.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedReps.map((rep, idx) => (
                  <Card key={idx} className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 p-4 md:p-6 flex items-center gap-4 rounded-[1.5rem] md:rounded-[2rem] shadow-none group overflow-hidden relative">
                    <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform duration-500">
                      <GraduationCap className="w-16 h-16 md:w-24 md:h-24 text-primary" />
                    </div>
                    <div className="relative w-12 h-12 md:w-16 md:h-16 shrink-0 shadow-xl rounded-xl md:rounded-2xl overflow-hidden ring-2 ring-primary/20">
                      <Image src={rep.imageUrl} alt={rep.name} fill className="object-cover" sizes="(max-width: 768px) 48px, 64px" />
                    </div>
                    <div className="flex-grow z-10">
                      <Badge className="bg-primary/20 text-primary border-none text-[7px] md:text-[8px] mb-1 px-2 py-0.5 uppercase tracking-tighter font-black">Dept. Representative</Badge>
                      <h3 className="text-base md:text-lg font-headline font-bold text-primary leading-none mb-1">{rep.name}</h3>
                      <p className="text-[9px] md:text-[10px] text-muted-foreground font-medium">{rep.branch} • Batch {rep.year}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" asChild className="rounded-full h-6 md:h-7 px-2 md:px-3 text-[9px] md:text-[10px] font-bold bg-primary hover:bg-primary/90">
                          <a href={`mailto:${rep.email}`}><Mail className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> Email</a>
                        </Button>
                        <Button variant="outline" size="sm" asChild className="rounded-full h-6 md:h-7 px-2 md:px-3 text-[9px] md:text-[10px] font-bold border-primary/20 hover:bg-primary/5">
                          <a href={rep.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1" /> LinkedIn</a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {filteredMaterials.length > 0 ? (
                filteredMaterials.map((material) => (
                  <Card key={material.id} className="group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 border-primary/10 hover:border-primary/40 rounded-[1.5rem] md:rounded-[2rem] bg-card overflow-hidden flex flex-col h-full">
                    <CardHeader className="space-y-2 md:space-y-4 pb-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary" className={cn(
                          "border-none font-bold px-2 md:px-3 py-0.5 md:py-1 text-[10px]",
                          material.type === 'YouTube Playlist' ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
                        )}>
                          {material.type === 'YouTube Playlist' && <Youtube className="h-3 w-3 mr-1 inline" />}
                          {material.type}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                          <Clock className="h-3 w-3" /> {formatDate(material.createdAt)}
                        </div>
                      </div>
                      <CardTitle className="text-lg md:text-xl font-headline font-bold group-hover:text-primary transition-colors leading-tight line-clamp-2">
                        {material.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {material.description}
                      </p>
                      <div className="mt-4 md:mt-6 flex flex-wrap gap-1.5 md:gap-2">
                         <Badge variant="outline" className="rounded-lg text-[9px] md:text-[10px] border-primary/10 bg-primary/[0.02]">
                            Sem {material.semester}
                         </Badge>
                         <Badge variant="outline" className="rounded-lg text-[9px] md:text-[10px] border-primary/10 bg-primary/[0.02]">
                            {material.branch.split(' ')[0]}
                         </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-4 md:pt-6 border-t border-primary/5 flex items-center justify-between bg-primary/[0.01]">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[9px] md:text-[10px] font-bold">
                            {material.author[0]}
                         </div>
                         <span className="text-[10px] md:text-xs font-medium text-muted-foreground truncate max-w-[80px] md:max-w-none">{material.author}</span>
                      </div>
                      <Button size="sm" className="rounded-full px-4 md:px-6 h-8 md:h-10 text-[10px] md:text-sm font-bold group/btn" asChild>
                        {material.type === 'YouTube Playlist' ? (
                          <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                            Watch <Youtube className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4" />
                          </a>
                        ) : (
                          <Link href={`/material/${material.id}`}>
                            View <ArrowRight className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-12 md:py-20 flex flex-col items-center justify-center text-center gap-4 md:gap-6 bg-secondary/20 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-primary/10">
                   <div className="bg-primary/10 p-4 md:p-6 rounded-full">
                      <FileText className="h-8 w-8 md:h-12 md:h-12 text-primary opacity-50" />
                   </div>
                   <div className="space-y-1 md:space-y-2 px-4">
                      <h3 className="text-xl md:text-2xl font-headline font-bold">No results found</h3>
                      <p className="text-xs md:text-sm text-muted-foreground max-w-xs mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
                   </div>
                   <Button variant="outline" className="rounded-full px-6 md:px-8 h-9 md:h-11 text-xs md:text-sm" onClick={() => {setSelectedBranch('all'); setSelectedSemester('all'); setSearchQuery('');}}>
                      Clear all filters
                   </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
