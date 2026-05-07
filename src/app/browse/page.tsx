
"use client";

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { SERVICE_CATEGORIES, MOCK_WORKERS, CITIES } from '@/lib/mock-data';
import { WorkerProfile } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, MapPin, Star, ShieldCheck, ArrowRight,
  Filter, CheckCircle, Info, X
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const db = useFirestore();
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'Delhi');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const workerQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'workerProfiles'));
  }, [db]);

  const { data: dbWorkers, isLoading } = useCollection<WorkerProfile>(workerQuery);

  const filteredWorkers = useMemo(() => {
    const combined = [...MOCK_WORKERS, ...(dbWorkers || [])];
    
    return combined.filter(w => {
      const catMatch = selectedCategory === 'all' || w.categoryId === selectedCategory;
      const cityMatch = selectedCity === 'all' || w.city === selectedCity;
      const searchMatch = w.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return catMatch && cityMatch && searchMatch;
    });
  }, [selectedCategory, selectedCity, searchQuery, dbWorkers]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCity('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary/5 border-b border-primary/10 py-16">
        <div className="container mx-auto px-4 space-y-4">
          <Badge className="bg-primary text-white rounded-full">ACTIVE DIRECTORY</Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-primary tracking-tighter">Find your Hero.</h1>
          <p className="text-muted-foreground text-xl max-w-xl">
            {filteredWorkers.length} verified professionals available {selectedCity !== 'all' ? `in ${selectedCity}` : 'nationwide'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8">
            <Card className="p-8 rounded-[2rem] border-primary/10 shadow-sm sticky top-24 bg-card">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold flex items-center gap-2"><Filter className="h-5 w-5" /> Filters</h3>
                  {(selectedCategory !== 'all' || selectedCity !== 'all' || searchQuery) && (
                    <Button variant="ghost" size="sm" onClick={resetFilters} className="text-primary hover:bg-primary/5 rounded-full px-4 h-8">
                      Clear
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quick Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Plumber, Electrician..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-secondary/50 border-none rounded-xl h-11 focus-visible:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select City</label>
                    <select 
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-secondary/50 border-none rounded-xl h-11 px-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none appearance-none"
                    >
                      <option value="all">All India</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Service Category</label>
                    <div className="flex flex-col gap-1.5">
                      <Button 
                        variant={selectedCategory === 'all' ? 'default' : 'ghost'} 
                        size="sm" 
                        className="justify-start rounded-xl h-10 font-bold"
                        onClick={() => setSelectedCategory('all')}
                      >
                        All Services
                      </Button>
                      {SERVICE_CATEGORIES.map(cat => (
                        <Button 
                          key={cat.id}
                          variant={selectedCategory === cat.id ? 'default' : 'ghost'} 
                          size="sm" 
                          className="justify-start rounded-xl h-10 font-bold"
                          onClick={() => setSelectedCategory(cat.id)}
                        >
                          {cat.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Results Grid */}
          <div className="flex-1 space-y-8">
            {filteredWorkers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredWorkers.map((worker) => (
                  <Card key={worker.id} className="group hover:shadow-2xl transition-all duration-500 border-primary/5 rounded-[2.5rem] overflow-hidden flex flex-col bg-card hover:-translate-y-1">
                    <CardHeader className="p-8 pb-4">
                      <div className="flex justify-between items-start">
                        <div className="relative h-20 w-20 rounded-[1.5rem] overflow-hidden shadow-xl border-4 border-white dark:border-primary/20">
                          <Image 
                            src={worker.profileImageUrl} 
                            alt={worker.fullName} 
                            fill 
                            className="object-cover group-hover:scale-110 transition-transform duration-500" 
                          />
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1.5 text-accent">
                            <Star className="h-5 w-5 fill-current" />
                            <span className="text-lg font-black">{worker.rating}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{worker.reviewCount} Reviews</span>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center gap-3">
                        <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors">{worker.fullName}</CardTitle>
                        {worker.isVerified && <CheckCircle className="h-5 w-5 text-primary fill-primary/10" />}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="rounded-full px-3">{worker.categoryName}</Badge>
                        <Badge variant="outline" className="rounded-full px-3 border-primary/10 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {worker.city}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 flex-grow space-y-6">
                      <p className="text-muted-foreground leading-relaxed line-clamp-2 italic">"{worker.bio}"</p>
                      
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Core Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {worker.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="text-[10px] border-primary/10 rounded-lg px-2 bg-primary/[0.02]">{skill}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-primary/5">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Starting From</span>
                          <span className="text-2xl font-black text-primary">₹{worker.baseCharge}<span className="text-sm text-muted-foreground font-bold">/hr</span></span>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                           <Info className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-0 border-t border-primary/5">
                      <Button className="w-full h-16 rounded-none font-black text-lg bg-primary hover:bg-primary/90 transition-all gap-3" asChild>
                        <Link href={`/worker/${worker.id}`}>
                          Book Service Now <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center gap-8 bg-secondary/10 rounded-[3rem] border-2 border-dashed border-primary/20 animate-in fade-in duration-500">
                <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center text-primary/40 relative">
                  <Search className="h-12 w-12" />
                  <div className="absolute -top-1 -right-1 h-8 w-8 bg-background rounded-full border border-primary/20 flex items-center justify-center">
                    <X className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold">No Heroes Found</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">We couldn't find any professionals matching your filters in {selectedCity}. Try adjusting your search.</p>
                </div>
                <Button onClick={resetFilters} className="rounded-2xl px-10 h-14 font-bold text-lg">Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
