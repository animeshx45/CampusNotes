
"use client";

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { BRANCHES, SEMESTERS, MOCK_MATERIALS } from '@/lib/mock-data';
import { StudyMaterial, Branch } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FileText, Download, User, Calendar, Search, SlidersHorizontal, ArrowRight, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const initialBranch = searchParams.get('branch') as Branch;
  
  const [selectedBranch, setSelectedBranch] = useState<string>(initialBranch || 'all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMaterials = useMemo(() => {
    return MOCK_MATERIALS.filter(m => {
      const branchMatch = selectedBranch === 'all' || m.branch === selectedBranch;
      const semMatch = selectedSemester === 'all' || m.semester.toString() === selectedSemester;
      const searchMatch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.description.toLowerCase().includes(searchQuery.toLowerCase());
      return branchMatch && semMatch && searchMatch;
    });
  }, [selectedBranch, selectedSemester, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-8">
        <div>
          <h1 className="text-4xl font-headline font-bold text-primary">Browse Materials</h1>
          <p className="text-muted-foreground">Find the best resources shared by your peers.</p>
        </div>
        <Button asChild className="rounded-full">
           <Link href="/upload">Contribute New</Link>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6 sticky top-24">
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

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase text-muted-foreground tracking-widest">
              Showing {filteredMaterials.length} results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMaterials.map((material) => (
              <Card key={material.id} className="hover:shadow-lg transition-all duration-300 border-none shadow-sm flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-accent/10 text-accent border-none rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {material.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {material.createdAt}
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
                      {material.author.charAt(0)}
                    </div>
                    {material.author}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" asChild className="hover:text-accent">
                      <Link href={`/material/${material.id}`}>
                        <BrainCircuit className="h-4 w-4 mr-1" /> AI Aid
                      </Link>
                    </Button>
                    <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90">
                      View
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}

            {filteredMaterials.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-3xl border border-dashed border-muted">
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
