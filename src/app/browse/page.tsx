"use client";

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { BRANCHES, SEMESTERS } from '@/lib/mock-data';
import { DEPARTMENT_REPRESENTATIVES } from '@/lib/department-data';
import { StudyMaterial, Branch } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar, Search, SlidersHorizontal, ArrowRight, BrainCircuit, Loader2, Mail, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const initialBranch = searchParams.get('branch') as Branch;
  const initialSearch = searchParams.get('search') || '';
  
  const db = useFirestore();
  const [selectedBranch, setSelectedBranch] = useState<string>(initialBranch || 'all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const materialsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'studyMaterials'), orderBy('createdAt', 'desc'));
  }, [db]);

  const { data: materials, isLoading } = useCollection<StudyMaterial>(materialsQuery);

  const filteredMaterials = useMemo(() => {
    if (!materials) return [];
    return materials.filter(m => {
      const branchMatch = selectedBranch === 'all' || m.branch === selectedBranch;
      const semMatch = selectedSemester === 'all' || m.semester.toString() === selectedSemester;
      const searchMatch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.description.toLowerCase().includes(searchQuery.toLowerCase());
      return branchMatch && semMatch && searchMatch;
    });
  }, [selectedBranch, selectedSemester, searchQuery, materials]);

  const selectedRep = useMemo(() => {
    if (selectedBranch === 'all') return null;
    return DEPARTMENT_REPRESENTATIVES.find(r => r.branch === selectedBranch);
  }, [selectedBranch]);

  const formatDate = (date: any) => {
    if (date instanceof Timestamp) return date.toDate().toLocaleDateString();
    if (typeof date === 'string') return new Date(date).toLocaleDateString();
    return new Date().toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading amazing resources...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-8">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary">Browse Materials</h1>
          <p className="text-muted-foreground">Find the best resources shared by your peers at NIT Srinagar.</p>
        </div>
        <Button asChild className="rounded-full">
           <Link href="/upload">Contribute New</Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
          <div className="bg-white dark:bg-card p-6 rounded-2xl border shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center gap-2 font-headline font-bold text-primary">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Keywords..." 
                  className="pl-9 bg-secondary border-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Branch</label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="bg-secondary border-none">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Semester</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="bg-secondary border-none">
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {SEMESTERS.map(s => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              className="w-full rounded-xl"
              onClick={() => {
                setSelectedBranch('all');
                setSelectedSemester('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          {selectedRep && (
            <Card className="bg-primary/5 border-primary/20 mb-8 overflow-hidden group border shadow-none">
              <div className="flex flex-col md:flex-row items-center p-6 gap-6">
                <div className="relative w-24 h-24 shrink-0">
                  <Image 
                    src={selectedRep.imageUrl} 
                    alt={selectedRep.name} 
                    fill 
                    className="rounded-2xl object-cover border-2 border-primary/20 shadow-md group-hover:scale-105 transition-transform"
                    data-ai-hint="student photo"
                  />
                </div>
                <div className="flex-grow text-center md:text-left space-y-2">
                  <div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-none mb-1 text-[10px] font-bold uppercase tracking-wider">
                      Department Representative
                    </Badge>
                    <h3 className="text-2xl font-headline font-bold text-primary">{selectedRep.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium">Batch of {selectedRep.year} • {selectedRep.branch}</p>
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                    <Button variant="secondary" size="sm" className="rounded-full h-8 px-4 text-xs font-bold" asChild>
                      <a href={`mailto:${selectedRep.email}`}><Mail className="h-3 w-3 mr-2" /> Email</a>
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full h-8 px-4 text-xs font-bold border-primary/20 hover:bg-primary/5" asChild>
                      <a href={selectedRep.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-3 w-3 mr-2" /> LinkedIn</a>
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block bg-primary/10 p-4 rounded-2xl max-w-[200px] text-xs text-primary/80 font-medium italic">
                  "{selectedRep.message}"
                </div>
              </div>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase text-muted-foreground tracking-widest">
              Showing {filteredMaterials.length} results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="hover:shadow-lg transition-all duration-300 border-none shadow-sm flex flex-col bg-white dark:bg-card">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-none rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {material.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {formatDate(material.createdAt)}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">
                    {material.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {material.description}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[10px] font-medium border-primary/20">{material.branch}</Badge>
                    <Badge variant="outline" className="text-[10px] font-medium border-primary/20">Sem {material.semester}</Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-primary font-bold">
                      {material.author?.charAt(0) || 'A'}
                    </div>
                    {material.author}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild className="hover:text-accent">
                      <Link href={`/material/${material.id}`}>
                        <BrainCircuit className="h-4 w-4 mr-1" /> AI Aid
                      </Link>
                    </Button>
                    <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90" asChild>
                      <Link href={`/material/${material.id}`}>
                        View
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}

            {filteredMaterials.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-4 bg-white dark:bg-card rounded-3xl border border-dashed border-muted">
                <div className="bg-secondary w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-headline font-bold text-primary">No materials found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">Try adjusting your filters or search keywords to find what you're looking for.</p>
                <Button onClick={() => {setSelectedBranch('all'); setSelectedSemester('all'); setSearchQuery('');}}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
