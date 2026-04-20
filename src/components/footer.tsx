
import Link from 'next/link';
import { Mail, MapPin, ExternalLink } from 'lucide-react';
import { Logo } from '@/components/logo';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo className="h-10 w-10 text-white" />
              <div className="flex flex-col">
                <span className="font-headline font-bold text-lg text-white leading-none">CampusNotes</span>
                <span className="text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest mt-1">NIT Srinagar</span>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              The official resource portal for students of NIT Srinagar. Access high-quality notes, assignments, and study materials for your semester exams.
            </p>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-4 text-sm uppercase tracking-wider text-white">Academics</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href={`/browse?branch=${encodeURIComponent('Information Technology')}`} className="hover:text-white transition-colors">Information Technology</Link></li>
              <li><Link href={`/browse?branch=${encodeURIComponent('Computer Science & Engineering')}`} className="hover:text-white transition-colors">Computer Science</Link></li>
              <li><Link href={`/browse?branch=${encodeURIComponent('Metallurgical & Materials Engineering')}`} className="hover:text-white transition-colors">Metallurgy</Link></li>
              <li><Link href={`/about`} className="hover:text-white transition-colors">About the Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-4 text-sm uppercase tracking-wider text-white">Institute Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="https://nitsri.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Official Website <ExternalLink className="h-3 w-3" /></a></li>
              <li><a href="https://nitsri.ac.in/Pages/Academic-Calendars.aspx" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Academic Calendar <ExternalLink className="h-3 w-3" /></a></li>
              <li><a href="https://nitsri.ac.in/Department/Deptindex.aspx?page=a&ItemID=s&nDeptID=i" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Departments <ExternalLink className="h-3 w-3" /></a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-4 text-sm uppercase tracking-wider text-white">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /> Hazratbal, Srinagar, J&K</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /> rajuranjanxbkj@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} CampusNotes. Designed for NIT Srinagar Students.</p>
        </div>
      </div>
    </footer>
  );
}
