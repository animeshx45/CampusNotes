"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, ExternalLink, Globe, CloudRain, Wind, ThermometerSun, MessageSquare } from 'lucide-react';
import { Logo } from '@/components/logo';

export function Footer() {
  const visitorCount = "0002486"; // Mock visitor count
  
  return (
    <footer className="w-full flex flex-col font-body">
      {/* Top Ticker / Weather Bar - Academic Green */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-[9px] md:text-xs font-bold shadow-lg relative z-10">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-2 md:gap-4">
          <div className="flex items-center gap-2">
            <span className="opacity-80">Campus Now :</span>
            <CloudRain className="h-3 w-3 md:h-4 md:w-4" />
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-1.5">
              <ThermometerSun className="h-3 w-3 md:h-3.5 md:w-3.5 opacity-70" />
              <span>12 °C</span>
            </div>
            <div className="hidden xs:flex items-center gap-1.5">
              <span className="opacity-70 text-[9px] md:text-[10px]">Humidity : 82</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="h-3 w-3 md:h-3.5 md:w-3.5 opacity-70" />
              <span>3 km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body - Dark Green/Black theme */}
      <div className="bg-card text-white py-12 md:py-16 px-4 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(22,163,74,0.05),transparent_40%)]" />
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 relative z-10">
          
          {/* Left Column: Portal Branding */}
          <div className="md:col-span-2 lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <Logo className="scale-110 lg:scale-125 origin-center lg:origin-left" />
            <div className="space-y-1">
              <h2 className="text-xl md:text-2xl font-headline font-bold tracking-tight">CampusNotes</h2>
              <p className="text-xs md:text-sm font-medium opacity-60">NIT Srinagar Study Portal</p>
            </div>
            <div className="space-y-3 text-xs md:text-sm opacity-80 font-medium">
              <p className="flex items-center justify-center lg:justify-start gap-3">
                <MapPin className="h-4 w-4 text-accent shrink-0" /> Hazratbal, Srinagar, J&K, 190006 📍
              </p>
              <p className="flex items-center justify-center lg:justify-start gap-3">
                <Mail className="h-4 w-4 text-accent shrink-0" /> rajuranjanxbkj@gmail.com
              </p>
              <p className="flex items-center justify-center lg:justify-start gap-3">
                <Globe className="h-4 w-4 text-accent shrink-0" /> www.nitsri.ac.in
              </p>
            </div>
          </div>

          {/* Divider (Desktop) */}
          <div className="hidden lg:block lg:col-span-1 border-r border-white/10 my-4 h-full mx-auto" />

          {/* Middle Columns: Links */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start">
            <div className="space-y-6 text-center lg:text-left">
              <h3 className="text-lg font-headline font-bold border-b border-primary/30 pb-2 w-fit mx-auto lg:mx-0">Explore Portal</h3>
              <ul className="space-y-4 text-sm font-medium opacity-70">
                <li><Link href="/about" className="hover:text-primary transition-colors flex items-center justify-center lg:justify-start gap-2 hover:translate-x-1 transition-transform">About CampusNotes</Link></li>
                <li><Link href="/forum" className="hover:text-primary transition-colors flex items-center justify-center lg:justify-start gap-2 hover:translate-x-1 transition-transform">Student Community</Link></li>
                <li><Link href="/browse" className="hover:text-primary transition-colors flex items-center justify-center lg:justify-start gap-2 hover:translate-x-1 transition-transform">Browse Repository</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors flex items-center justify-center lg:justify-start gap-2 hover:translate-x-1 transition-transform">Contact Support</Link></li>
                <li><a href="https://nitsri.ac.in" target="_blank" className="hover:text-primary transition-colors flex items-center justify-center lg:justify-start gap-1 hover:translate-x-1 transition-transform">Official NIT Website <ExternalLink className="h-3 w-3" /></a></li>
              </ul>
            </div>
          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end gap-8 md:gap-10">
            <div className="w-full max-w-[240px] p-3 border border-dashed border-primary/20 rounded-xl text-center bg-primary/5">
               <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Srinagar Air Quality Index : 42</span>
            </div>

            <div className="space-y-4 w-full flex flex-col items-center lg:items-end">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-60">Feedback Hub</h3>
              <Link href="/contact" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-primary/20">
                  <MessageSquare className="h-4 w-4" /> Share Ideas
                </button>
              </Link>
            </div>

            <div className="space-y-4 w-full flex flex-col items-center lg:items-end">
              <h3 className="text-xs font-black uppercase tracking-widest opacity-60">Visitor Counter :</h3>
              <div className="flex gap-1">
                {visitorCount.split('').map((digit, i) => (
                  <span key={i} className="bg-white/5 border border-white/10 h-8 md:h-10 w-6 md:w-8 flex items-center justify-center rounded-lg font-mono text-lg md:text-xl font-black text-primary shadow-inner">
                    {digit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Final Bottom Bar */}
      <div className="bg-background text-muted-foreground py-6 px-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest border-t border-white/5">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-4 text-center">
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
            <span className="text-foreground">© CampusNotes | NIT Srinagar</span>
            <span className="opacity-20 hidden md:block">|</span>
            <span className="hidden xs:inline">Peer Support Initiative</span>
            <span className="opacity-20 hidden md:block">|</span>
            <Link href="/about" className="hover:text-primary transition-colors">Credits</Link>
          </div>
          <div className="w-full lg:w-auto text-primary/60">
            <span>Built by the Student Community for the NIT Family</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
