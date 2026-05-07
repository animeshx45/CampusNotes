
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { SERVICE_CATEGORIES, CITIES } from '@/lib/mock-data';
import { 
  Search, Droplets, Zap, Brush, Baby, Wind, Hammer, MapPin, Star, ShieldCheck, ArrowRight, UserCircle2
} from 'lucide-react';
import Image from 'next/image';

const CATEGORY_ICONS: Record<string, any> = {
  'Droplets': Droplets,
  'Zap': Zap,
  'Brush': Brush,
  'Baby': Baby,
  'Wind': Wind,
  'Hammer': Hammer,
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Delhi');

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://picsum.photos/seed/homehero-bg/1920/1080" 
            alt="Hero Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" /> Trusted Household Services
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Find the perfect <span className="text-primary">Hero</span> for your home.
            </h1>
            <p className="text-xl text-muted-foreground">
              Hire verified professionals for plumbing, cleaning, repairs, and more. Transparent pricing, instant booking.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-2xl shadow-2xl border border-primary/10">
              <div className="flex items-center gap-2 px-3 border-r">
                <MapPin className="h-5 w-5 text-primary" />
                <select 
                  className="bg-transparent outline-none font-medium text-sm"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div className="flex-grow flex items-center gap-2 px-3">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="What service do you need?" 
                  className="border-none shadow-none focus-visible:ring-0 text-base h-auto py-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button asChild size="lg" className="rounded-xl px-8 shadow-lg shadow-primary/20">
                <Link href={`/browse?search=${searchQuery}&city=${selectedCity}`}>Search Hero</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Popular Services</h2>
            <p className="text-muted-foreground">Top rated services in your area</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/browse">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.iconName] || Search;
            return (
              <Link key={cat.id} href={`/browse?category=${cat.id}`}>
                <Card className="group hover:border-primary transition-all duration-300 cursor-pointer h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl">
                  <CardContent className="flex flex-col items-center justify-center p-8 gap-4 text-center">
                    <div className="p-4 rounded-2xl bg-secondary group-hover:bg-primary transition-colors">
                      <Icon className="h-8 w-8 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <span className="font-bold">{cat.name}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Verified Profiles</h3>
            <p className="text-muted-foreground">Every worker on our platform undergoes a strict ID and skill verification process.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Star className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Transparent Ratings</h3>
            <p className="text-muted-foreground">Read real reviews from other homeowners to choose the best hero for your task.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <UserCircle2 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Community Support</h3>
            <p className="text-muted-foreground">Our 24/7 assistant is here to help you resolve any issues during or after service.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <Card className="bg-primary border-none text-primary-foreground rounded-[2.5rem] p-12 overflow-hidden relative shadow-2xl shadow-primary/30">
          <div className="relative z-10 max-w-2xl space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold">Are you a skilled professional?</h2>
            <p className="text-xl opacity-90">Join HomeHero and grow your business. Get direct bookings from customers in your city.</p>
            <Button asChild size="lg" variant="secondary" className="rounded-xl px-10 h-14 text-lg font-bold">
              <Link href="/worker/register">Register as Worker</Link>
            </Button>
          </div>
          <div className="absolute right-0 bottom-0 p-12 opacity-10 hidden md:block">
            <Hammer className="h-80 w-80" />
          </div>
        </Card>
      </section>
    </div>
  );
}
