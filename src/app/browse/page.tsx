
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
import { Search, SlidersHorizontal, ArrowRight, BrainCircuit, Loader2, Mail, Linkedin, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const db = useFirestore();
  
  const [selectedBranch, setSelectedBranch] = useState<string>(searchParams.get('branch') || 'all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const materialsQuery = useMemoFirebase(() => db ? query(collection(db, 'studyMaterials'), orderBy('createdAt', 'desc')) : null, [db]);
  const { data: materials, isLoading } = useCollection<StudyMaterial>(materialsQuery);

  const filteredMaterials = useMemo(() => {
    if (!materials) return [];
    return materials.filter(m => {
      const branchMatch = selectedBranch === 'all' || m.branch === selectedBranch;
      const semMatch = selectedSemester === 'all' || m.semester.toString() === selectedSemester;
      const searchMatch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase());
      return branchMatch && semMatch && searchMatch;
    });
  }, [selectedBranch, selectedSemester, searchQuery, materials]);

  const selectedRep = useMemo(() => {
    if (selectedBranch === 'all') return null;
    return DEPARTMENT_REPRESENTATIVES.find(r => r.branch === selectedBranch);
  }, [selectedBranch]);

  if (isLoading) return <div className="py-32 flex justify-center"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex justify-between items-center border-b pb-8">
        <div><h1 className="text-4xl font-bold text-primary">Browse Materials</h1><p className="text-muted-foreground">Find peer-shared resources at NIT Srinagar.</p></div>
        <Button asChild className="rounded-full"><Link href="/upload">Contribute</Link></Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center gap-2 font-bold text-primary"><SlidersHorizontal className="h-4 w-4" /> Filters</div>
            <Input placeholder="Search keywords..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-secondary border-none" />
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="bg-secondary border-none"><SelectValue placeholder="All Branches" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Branches</SelectItem>{BRANCHES.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="bg-secondary border-none"><SelectValue placeholder="All Semesters" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Semesters</SelectItem>{SEMESTERS.map(s => <SelectItem key={s} value={s.toString()}>Semester {s}</SelectItem>)}</SelectContent>
            </Select>
            <Button variant="outline" className="w-full" onClick={() => {setSelectedBranch('all'); setSelectedSemester('all'); setSearchQuery('');}}>Reset</Button>
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          {selectedRep && (
            <Card className="bg-primary/5 border-primary/20 p-6 flex items-center gap-6 rounded-2xl shadow-none">
              <div className="relative w-20 h-20 shrink-0">
                <Image src={selectedRep.imageUrl} alt={selectedRep.name} fill className="rounded-xl object-cover" />
              </div>
              <div className="flex-grow">
                <Badge className="bg-primary/10 text-primary border-none text-[10px] mb-1">DEPARTMENT REP</Badge>
                <h3 className="text-xl font-bold text-primary">{selectedRep.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedRep.branch} • Batch {selectedRep.year}</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="secondary" size="sm" asChild className="rounded-full h-8 px-4 text-xs font-bold"><a href={`mailto:${selectedRep.email}`}><Mail className="h-3 w-3 mr-2" /> Email</a></Button>
                  <Button variant="outline" size="sm" asChild className="rounded-full h-8 px-4 text-xs font-bold border-primary/20"><a href={selectedRep.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-3 w-3 mr-2" /> LinkedIn</a></Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="hover:shadow-lg transition-all border-none shadow-sm flex flex-col bg-white">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-none">{material.type}</Badge>
                  </div>
                  <CardTitle className="text-xl font-bold">{material.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow"><p className="text-sm text-muted-foreground line-clamp-2">{material.description}</p></CardContent>
                <CardFooter className="pt-4 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{material.author}</span>
                  <Button size="sm" className="rounded-full" asChild><Link href={`/material/${material.id}`}>View <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
