import { BookOpen, Users, ShieldCheck, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl space-y-16">
      {/* Top Header Section */}
      <section className="text-center space-y-6">
        <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center mx-auto mb-6 overflow-hidden shadow-xl border border-primary/15">
          <img 
            src="https://cdn.corenexis.com/f/DEzTAKmN1Fm.png" 
            alt="NIT Srinagar Logo" 
            className="object-contain h-20 w-20" 
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-primary/80">CampusNotes</h2>
          <h1 className="text-4xl md:text-5xl font-black text-foreground">About CampusNotes</h1>
        </div>
        <p className="text-xl text-muted-foreground leading-relaxed font-medium max-w-2xl mx-auto">
          The best place for NIT Srinagar students to find and share study materials.
        </p>
      </section>

      {/* Goal & Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4 bg-secondary/10 p-8 rounded-[2rem] border border-primary/5">
          <div className="flex items-center gap-3 text-primary">
            <BookOpen className="h-6 w-6" />
            <h2 className="text-xl font-bold">Our Goal</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm font-medium">
            We want to make studying easier. CampusNotes brings all the scattered notes and old exam papers into one easy place for everyone at NIT Srinagar.
          </p>
        </div>

        <div className="space-y-4 bg-secondary/10 p-8 rounded-[2rem] border border-primary/5">
          <div className="flex items-center gap-3 text-primary">
            <Users className="h-6 w-6" />
            <h2 className="text-xl font-bold">By Students, For Students</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed text-sm font-medium">
            Everything here is shared by students like you. When you share a note, you help a fellow NITian succeed. It's all about helping each other.
          </p>
        </div>
      </div>

      {/* Core Values Section */}
      <section className="bg-secondary/20 rounded-[2.5rem] p-8 md:p-12 space-y-10 border border-primary/5">
        <h2 className="text-3xl font-black text-primary text-center">What We Value</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="bg-white dark:bg-card w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="text-accent h-6 w-6" />
            </div>
            <h3 className="font-bold text-sm">Good Quality</h3>
            <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">We check materials to make sure they are helpful.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="bg-white dark:bg-card w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <Heart className="text-accent h-6 w-6" />
            </div>
            <h3 className="font-bold text-sm">Always Free</h3>
            <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">This site will always be free for all students.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="bg-white dark:bg-card w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-md overflow-hidden p-2">
              <img 
                src="https://cdn.corenexis.com/f/DEzTAKmN1Fm.png" 
                alt="NIT Srinagar Logo" 
                className="object-contain h-full w-full" 
              />
            </div>
            <h3 className="font-bold text-sm">Made for NIT</h3>
            <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Built specifically for the NIT Srinagar courses.</p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="text-center py-8">
        <p className="text-xs text-muted-foreground italic max-w-xl mx-auto leading-relaxed">
          CampusNotes is a student-run project. It is not an official part of the NIT Srinagar office. Please use these notes as a help, but always listen to your teachers!
        </p>
      </section>
    </div>
  );
}
