
import { BookOpen, Users, ShieldCheck, Heart } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl space-y-16">
      <section className="text-center space-y-6">
        <div className="bg-primary/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 p-3">
          <Logo className="h-full w-full" />
        </div>
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary">About CampusNotes</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          The ultimate peer-to-peer study resource platform dedicated to the students of National Institute of Technology, Srinagar.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <BookOpen className="h-6 w-6" />
            <h2 className="text-2xl font-headline font-bold">Our Mission</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We believe that education should be accessible and collaborative. CampusNotes was built to centralize the wealth of knowledge scattered across different student circles at NIT Srinagar. From semester notes to previous year papers, we aim to provide every student with the tools they need to excel.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Users className="h-6 w-6" />
            <h2 className="text-2xl font-headline font-bold">Student Driven</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            This platform is powered by you. Every document uploaded is a contribution from a fellow student who wants to help their peers. It's this spirit of "NITians helping NITians" that makes CampusNotes a vibrant community resource.
          </p>
        </div>
      </div>

      <section className="bg-secondary rounded-[2.5rem] p-8 md:p-12 space-y-8">
        <h2 className="text-3xl font-headline font-bold text-primary text-center">Platform Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="bg-white dark:bg-card w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="text-accent h-6 w-6" />
            </div>
            <h3 className="font-bold">Quality</h3>
            <p className="text-xs text-muted-foreground">Resources are reviewed by senior students for accuracy and relevance.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="bg-white dark:bg-card w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Heart className="text-accent h-6 w-6" />
            </div>
            <h3 className="font-bold">Free Access</h3>
            <p className="text-xs text-muted-foreground">Always free for students. No hidden costs or subscriptions.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="bg-white dark:bg-card w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Logo className="text-accent h-6 w-6" />
            </div>
            <h3 className="font-bold">Academic Focus</h3>
            <p className="text-xs text-muted-foreground">Tailored strictly to the NIT Srinagar engineering curricula.</p>
          </div>
        </div>
      </section>

      <section className="text-center py-8">
        <p className="text-sm text-muted-foreground italic">
          Disclaimer: CampusNotes is a student-led initiative and is not an official administrative portal of NIT Srinagar. Please use materials as supplementary aids to your official classroom instruction.
        </p>
      </section>
    </div>
  );
}
