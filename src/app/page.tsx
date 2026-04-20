
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BRANCHES } from '@/lib/mock-data';
import { Search, Zap, Globe, Code, Settings, FlaskConical, Construction, Download, Clock, Upload, Cpu, Layers } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const BRANCH_ICONS: Record<string, any> = {
  'Information Technology': Globe,
  'Computer Science & Engineering': Code,
  'Electrical Engineering': Zap,
  'Mechanical Engineering': Settings,
  'Chemical Engineering': FlaskConical,
  'Civil Engineering': Construction,
  'Electronics & Communication Engineering': Cpu,
  'Metallurgical & Materials Engineering': Layers
};

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage?.imageUrl || 'https://picsum.photos/seed/nits/1200/600'}
            alt={heroImage?.description || 'NIT Srinagar'}
            fill
            className="object-cover opacity-20 scale-105"
            priority
            data-ai-hint="university campus"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 bg-secondary px-3 py-1 rounded-full border border-primary/20">
              <span className="flex h-2 w-2 rounded-full bg-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Official Student Resource</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight text-primary">
              Your <span className="text-accent underline decoration-4 underline-offset-8 italic">CampusNotes</span> for NIT Excellence.
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              The premier repository for notes, assignments, and previous year papers tailored specifically for NIT Srinagar engineering curricula.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="rounded-full px-8 h-12 shadow-lg shadow-primary/20">
                <Link href="/browse">Explore Materials</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 border-primary/20">
                <Link href="/upload">Contribute Notes</Link>
              </Button>
            </div>
            <div className="flex items-center gap-8 pt-4 border-t border-muted w-max">
              <div>
                <span className="block text-2xl font-bold text-primary">2,500+</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Resources</span>
              </div>
              <div className="w-px h-10 bg-muted" />
              <div>
                <span className="block text-2xl font-bold text-primary">12k+</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Students</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block animate-in fade-in zoom-in duration-1000">
             <div className="relative aspect-square max-w-md mx-auto">
               <div className="absolute inset-0 bg-accent/10 rounded-3xl -rotate-6 transform translate-x-4 translate-y-4" />
               <div className="relative bg-white dark:bg-card p-8 rounded-3xl shadow-2xl border flex flex-col gap-6">
                 <div className="flex items-center justify-between">
                   <div className="p-3 bg-secondary rounded-2xl">
                     <Clock className="text-primary h-6 w-6" />
                   </div>
                   <div className="text-right">
                     <span className="block text-xs text-muted-foreground font-bold uppercase tracking-tighter">Latest Resource</span>
                     <span className="font-headline font-bold text-lg">CSE Mid-Sem 2024</span>
                   </div>
                 </div>
                 <div className="space-y-4">
                    <div className="h-4 w-full bg-secondary rounded-full animate-pulse" />
                    <div className="h-4 w-3/4 bg-secondary rounded-full animate-pulse" />
                    <div className="h-4 w-5/6 bg-secondary rounded-full animate-pulse" />
                 </div>
                 <Button className="w-full rounded-xl bg-accent hover:bg-accent/90 text-white font-bold">
                   <Download className="mr-2 h-4 w-4" /> Download Now
                 </Button>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Branches Section */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-headline font-bold text-primary">Browse by Department</h2>
          <p className="text-muted-foreground">Select your engineering department to view curated materials.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {BRANCHES.map((branch) => {
            const Icon = BRANCH_ICONS[branch] || Globe;
            return (
              <Link key={branch} href={`/browse?branch=${encodeURIComponent(branch)}`}>
                <Card className="hover:shadow-xl hover:border-accent/50 transition-all duration-300 group cursor-pointer h-full border-none shadow-sm bg-white dark:bg-card">
                  <CardContent className="flex flex-col items-center justify-center p-8 gap-4 h-full text-center">
                    <div className="p-4 rounded-2xl bg-secondary group-hover:bg-accent group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                      <Icon className="h-8 w-8 text-primary group-hover:text-white" />
                    </div>
                    <span className="font-headline font-bold text-primary group-hover:text-accent transition-colors leading-tight">
                      {branch}
                    </span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Stats/Features */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="flex gap-4 items-start">
             <div className="bg-white dark:bg-card p-3 rounded-xl shadow-sm border border-primary/10"><Search className="text-accent" /></div>
             <div>
               <h3 className="font-headline font-bold text-primary">Robust Search</h3>
               <p className="text-sm text-muted-foreground">Find exactly what you need with advanced filters for subjects and semester.</p>
             </div>
           </div>
           <div className="flex gap-4 items-start">
             <div className="bg-white dark:bg-card p-3 rounded-xl shadow-sm border border-primary/10"><Upload className="text-accent" /></div>
             <div>
               <h3 className="font-headline font-bold text-primary">Student Driven</h3>
               <p className="text-sm text-muted-foreground">The platform is powered by contributions from students across all years.</p>
             </div>
           </div>
           <div className="flex gap-4 items-start">
             <div className="bg-white dark:bg-card p-3 rounded-xl shadow-sm border border-primary/10"><Zap className="text-accent" /></div>
             <div>
               <h3 className="font-headline font-bold text-primary">AI Study Aid</h3>
               <p className="text-sm text-muted-foreground">Generate summaries and mock exam questions instantly from any note.</p>
             </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-accent text-white p-12 rounded-[2.5rem] relative overflow-hidden flex flex-col items-center text-center gap-6">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
           
           <h2 className="text-4xl font-headline font-bold">Ready to contribute?</h2>
           <p className="max-w-2xl text-accent-foreground/90 text-lg">
             Your notes could help someone clear their backlogs or score an S grade. Share your knowledge with the NIT community today.
           </p>
           <Button asChild size="lg" variant="secondary" className="rounded-full px-12 h-14 font-bold shadow-lg">
             <Link href="/upload">Upload Material Now</Link>
           </Button>
        </div>
      </section>
    </div>
  );
}
