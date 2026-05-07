
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
  Search, SlidersHorizontal, MapPin, Star, ShieldCheck, ArrowRight,
  Filter, CheckCircle, Info
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const db = useFirestore();
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'Delhi');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // In a real app, we'd query Firestore. For MVP, we combine mock and db data.
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary/5 border-b border-primary/10 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-primary mb-4">Find your Home Hero</h1>
          <p className="text-muted-foreground text-lg">Verified professionals available in {selectedCity}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-8">
            <Card className="p-6 rounded-2xl border-primary/10 shadow-sm sticky top-24">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2"><Filter className="h-4 w-4" /> Filters</h3>
                  <Button variant="ghost" size="sm" onClick={() => { setSelectedCategory('all'); setSelectedCity('Delhi'); setSearchQuery(''); }}>Reset</Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Plumber, Electrician..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-secondary/50 border-none rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City</label>
                    <select 
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-secondary/50 border-none rounded-xl h-10 px-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="all">All Cities</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</label>
                    <div className="grid grid-cols-1 gap-2">
                      <Button 
                        variant={selectedCategory === 'all' ? 'default' : 'ghost'} 
                        size="sm" 
                        className="justify-start rounded-lg"
                        onClick={() => setSelectedCategory('all')}
                      >
                        All Services
                      </Button>
                      {SERVICE_CATEGORIES.map(cat => (
                        <Button 
                          key={cat.id}
                          variant={selectedCategory === cat.id ? 'default' : 'ghost'} 
                          size="sm" 
                          className="justify-start rounded-lg"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredWorkers.map((worker) => (
                  <Card key={worker.id} className="group hover:shadow-xl transition-all duration-300 border-primary/5 rounded-2xl overflow-hidden flex flex-col">
                    <CardHeader className="p-6 pb-2">
                      <div className="flex justify-between items-start gap-4">
                        <div className="relative h-16 w-16 rounded-2xl overflow-hidden shadow-md">
                          <Image 
                            src={worker.profileImageUrl} 
                            alt={worker.fullName} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 text-accent">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-bold">{worker.rating}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{worker.reviewCount} reviews</span>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{worker.fullName}</CardTitle>
                        {worker.isVerified && <CheckCircle className="h-4 w-4 text-primary" />}
                      </div>
                      <Badge variant="secondary" className="w-fit">{worker.categoryName}</Badge>
                    </CardHeader>
                    <CardContent className="p-6 pt-2 flex-grow space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{worker.bio}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {worker.skills.map(skill => (
                          <Badge key={skill} variant="outline" className="text-[10px] border-primary/10">{skill}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 pt-4 border-t border-primary/5">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Starts from</span>
                          <span className="font-bold text-primary">₹{worker.baseCharge}/hr</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">Location</span>
                          <span className="text-sm flex items-center gap-1"><MapPin className="h-3 w-3" /> {worker.city}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 bg-primary/[0.02] border-t border-primary/5">
                      <Button className="w-full rounded-xl font-bold" asChild>
                        <Link href={`/worker/${worker.id}`}>View Profile & Hire <ArrowRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center gap-6 bg-secondary/20 rounded-3xl border-2 border-dashed border-primary/10">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary/40">
                  <Search className="h-10 w-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">No Heroes found</h3>
                  <p className="text-muted-foreground max-w-sm">We couldn't find any workers matching your filters in {selectedCity}. Try adjusting your search.</p>
                </div>
                <Button onClick={() => { setSelectedCategory('all'); setSelectedCity('all'); setSearchQuery(''); }}>Clear all filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
