
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MapPin, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              <span className="font-headline font-bold text-lg">NIT StudySync</span>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              The official resource portal for students of NIT Srinagar. Access high-quality notes, assignments, and study materials for your semester exams.
            </p>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-4 text-sm uppercase tracking-wider">Academics</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/browse?branch=IT" className="hover:text-white transition-colors">Information Technology</Link></li>
              <li><Link href="/browse?branch=CS" className="hover:text-white transition-colors">Computer Science</Link></li>
              <li><Link href="/browse?branch=Electrical" className="hover:text-white transition-colors">Electrical Engineering</Link></li>
              <li><Link href="/browse?branch=Mechanical" className="hover:text-white transition-colors">Mechanical Engineering</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-4 text-sm uppercase tracking-wider">Institute Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="https://nitsri.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Official Website</a></li>
              <li><a href="https://nitsri.ac.in/Pages/Academic-Calendars.aspx" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Academic Calendar</a></li>
              <li><a href="https://nitsri.ac.in/Pages/Department-List.aspx" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Departments</a></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About the Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /> Hazratbal, Srinagar, J&K</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /> support@studysync.nitsri.ac.in</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /> +91-194-2422032</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} NIT StudySync. Designed for NIT Srinagar Students.</p>
        </div>
      </div>
    </footer>
  );
}
