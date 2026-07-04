
import { BookOpen, Users, ShieldCheck, Heart } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl space-y-16">
      <section className="text-center space-y-6">
        <div className="bg-primary/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 p-3">
          <Logo className="h-full w-full" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary">About CampusNotes</h1>
        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
          The best place for NIT Srinagar students to find and share study materials.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <BookOpen className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Our Goal</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We want to make studying easier. CampusNotes brings all the scattered notes and old exam papers into one easy place for everyone at NIT Srinagar.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Users className="h-6 w-6" />
            <h2 className="text-2xl font-bold">By Students, For Students</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Everything here is shared by students like you. When you share a note, you help a fellow NITian succeed. It's all about helping each other.
          </p>
        </div>
      </div>

      <section className="bg-secondary rounded-[2rem] p-8 md:p-12 space-y-8">
        <h2 className="text-3xl font-bold text-primary text-center">What We Value</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="bg-white dark:bg-card w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="text-accent h-6 w-6" />
            </div>
            <h3 className="font-bold">Good Quality</h3>
            <p className="text-xs text-muted-foreground">We check materials to make sure they are helpful.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="bg-white dark:bg-card w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Heart className="text-accent h-6 w-6" />
            </div>
            <h3 className="font-bold">Always Free</h3>
            <p className="text-xs text-muted-foreground">This site will always be free for all students.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="bg-white dark:bg-card w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Logo className="text-accent h-6 w-6" />
            </div>
            <h3 className="font-bold">Made for NIT</h3>
            <p className="text-xs text-muted-foreground">Built specifically for the NIT Srinagar courses.</p>
          </div>
        </div>
      </section>

      <section className="text-center py-8">
        <p className="text-sm text-muted-foreground italic">
          CampusNotes is a student-run project. It is not an official part of the NIT Srinagar office. Please use these notes as a help, but always listen to your teachers!
        </p>
      </section>
    </div>
  );
}
