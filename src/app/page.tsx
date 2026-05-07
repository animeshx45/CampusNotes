
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SERVICE_CATEGORIES, CITIES } from '@/lib/mock-data';
import { 
  Search, Droplets, Zap, Brush, Baby, Wind, Hammer, MapPin, Star, ShieldCheck, 
  ArrowRight, UserCircle2, Paintbrush, Bug, Leaf, Cpu
} from 'lucide-react';
import Image from 'next/image';

const CATEGORY_ICONS: Record<string, any> = {
  'Droplets': Droplets,
  'Zap': Zap,
  'Brush': Brush,
  'Baby': Baby,
  'Wind': Wind,
  'Hammer': Hammer,
  'Paintbrush': Paintbrush,
  'Bug': Bug,
  'Leaf': Leaf,
  'Cpu': Cpu,
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Delhi');

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/homehero-bg/1920/1080" 
            alt="Hero Background"
            fill
            className="object-cover opacity-30"
            priority
            data-ai-hint="living room"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
              <ShieldCheck className="h-4 w-4" /> 100% Verified Professionals
            </div>
            <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter">
              Your Home, <br /><span className="text-primary italic">Our Priority.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl">
              Hire trusted heroes for plumbing, cleaning, repairs, and more. Instant booking with transparent, upfront pricing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 bg-card p-6 rounded-[2rem] shadow-2xl border border-primary/10 max-w-2xl">
              <div className="flex items-center gap-2 px-4 border-r border-border/50">
                <MapPin className="h-5 w-5 text-primary" />
                <select 
                  className="bg-transparent outline-none font-bold text-sm"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div className="flex-grow flex items-center gap-2 px-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="What service do you need?" 
                  className="border-none shadow-none focus-visible:ring-0 text-lg h-auto py-0 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button asChild size="lg" className="rounded-2xl px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20">
                <Link href={`/browse?search=${searchQuery}&city=${selectedCity}`}>Find a Hero</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-4xl font-bold tracking-tight">Popular Services</h2>
            <p className="text-muted-foreground text-lg">Hand-picked professionals rated 4.5+ stars in {selectedCity}</p>
          </div>
          <Button variant="outline" asChild className="rounded-full px-8 border-primary/20">
            <Link href="/browse">Explore All Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.iconName] || Search;
            return (
              <Link key={cat.id} href={`/browse?category=${cat.id}`}>
                <Card className="group hover:border-primary/50 transition-all duration-300 cursor-pointer h-full rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl border-primary/5">
                  <CardContent className="flex flex-col items-center justify-center p-10 gap-6 text-center">
                    <div className="p-5 rounded-3xl bg-primary/5 group-hover:bg-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                      <Icon className="h-10 w-10 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <div className="space-y-1">
                      <span className="font-bold text-lg block">{cat.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Book Now</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="bg-primary/5 py-24">
        <div className="container mx-auto px-4 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Why HomeHero?</h2>
            <p className="text-muted-foreground text-lg">We take the risk out of home services.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-card p-10 rounded-[2.5rem] flex flex-col items-center text-center space-y-6 shadow-sm border border-primary/5">
              <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold">Verified Profiles</h3>
              <p className="text-muted-foreground">Every worker undergoes multi-step ID and skill verification before joining.</p>
            </div>
            <div className="bg-card p-10 rounded-[2.5rem] flex flex-col items-center text-center space-y-6 shadow-sm border border-primary/5">
              <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
                <Star className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold">Transparent Ratings</h3>
              <p className="text-muted-foreground">Read real reviews from other homeowners to choose the best hero for your task.</p>
            </div>
            <div className="bg-card p-10 rounded-[2.5rem] flex flex-col items-center text-center space-y-6 shadow-sm border border-primary/5">
              <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary">
                <UserCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-bold">Safety First</h3>
              <p className="text-muted-foreground">Emergency contacts and real-time support during every service booking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Institute Spotlight */}
      <section className="container mx-auto px-4">
        <Card className="bg-secondary/30 border-none rounded-[3rem] p-12 md:p-20 overflow-hidden relative flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 relative z-10 text-center md:text-left">
            <Badge className="bg-accent text-white px-4 py-1 rounded-full text-xs font-bold">COMMUNITY FOCUS</Badge>
            <h2 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter text-primary">Serving the Heart of <br /> NIT Srinagar.</h2>
            <p className="text-xl text-muted-foreground max-w-xl">
              HomeHero is proud to serve the NIT Srinagar community. We provide specialized support for campus residents and local households with trusted professionals.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <Button asChild size="lg" className="rounded-2xl px-10 h-14 text-lg font-bold shadow-xl shadow-primary/20">
                 <a href="https://nitsri.ac.in/" target="_blank" rel="noopener noreferrer">Visit NIT Website</a>
               </Button>
               <Button variant="outline" asChild size="lg" className="rounded-2xl px-10 h-14 text-lg font-bold border-primary/20">
                 <a href="https://en.wikipedia.org/wiki/National_Institute_of_Technology,_Srinagar" target="_blank" rel="noopener noreferrer">About Srinagar</a>
               </Button>
            </div>
          </div>
          <div className="flex-1 relative w-full aspect-square md:aspect-auto md:h-[500px] rounded-[3rem] overflow-hidden shadow-2xl">
             <Image 
               src="https://picsum.photos/seed/nitsri-campus/800/800" 
               alt="NIT Srinagar Campus" 
               fill 
               className="object-cover"
               data-ai-hint="university campus"
             />
          </div>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <Card className="bg-primary border-none text-primary-foreground rounded-[3rem] p-12 md:p-24 overflow-hidden relative shadow-2xl shadow-primary/30 group">
          <div className="relative z-10 max-w-3xl space-y-8">
            <h2 className="text-5xl md:text-8xl font-bold leading-[0.8] tracking-tighter">Are you a <br /> skilled professional?</h2>
            <p className="text-2xl opacity-90 max-w-xl">Join the HomeHero family and grow your business. Get direct bookings from verified customers in your city.</p>
            <Button asChild size="lg" variant="secondary" className="rounded-2xl px-12 h-16 text-xl font-bold hover:scale-105 transition-transform shadow-2xl">
              <Link href="/worker/register">Register as a Hero</Link>
            </Button>
          </div>
          <div className="absolute right-0 bottom-0 p-12 opacity-10 hidden lg:block group-hover:scale-110 transition-transform duration-700">
            <Hammer className="h-[400px] w-[400px]" />
          </div>
        </Card>
      </section>
    </div>
  );
}
