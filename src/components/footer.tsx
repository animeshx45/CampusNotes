
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, ExternalLink, Globe, CloudRain, Wind, ThermometerSun, MessageSquare } from 'lucide-react';
import { Logo } from '@/components/logo';

export function Footer() {
  const visitorCount = "0002486"; // Mock visitor count
  
  return (
    <footer className="w-full flex flex-col font-body">
      {/* Top Ticker / Weather Bar - Switched to Academic Green */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-xs font-bold shadow-lg relative z-10">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="opacity-80">On Campus :</span>
            <CloudRain className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <ThermometerSun className="h-3.5 w-3.5 opacity-70" />
              <span>Temp : 12 °C</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="opacity-70 text-[10px]">Humidity : 82</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="h-3.5 w-3.5 opacity-70" />
              <span>Wind : 3 km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Body - Dark Green/Black theme */}
      <div className="bg-card text-white py-16 px-4 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(22,163,74,0.05),transparent_40%)]" />
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          
          {/* Left Column: Institution Branding */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            <div className="relative h-24 w-24 bg-white rounded-full p-1 shadow-2xl">
               <Image 
                src="https://cdn.corenexis.com/f/DEzTAKmN1Fm.png"
                alt="NIT Srinagar Logo"
                fill
                className="object-contain rounded-full"
                unoptimized
               />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-headline font-bold tracking-tight">National Institute of Technology Srinagar</h2>
              <p className="text-sm font-medium opacity-60">An Institute of National Importance</p>
            </div>
            <div className="space-y-4 text-sm opacity-80 font-medium">
              <p className="flex items-center justify-center lg:justify-start gap-2">
                <MapPin className="h-4 w-4 text-accent" /> Hazratbal, Srinagar, J&K, 190006 📍
              </p>
              <p className="flex items-center justify-center lg:justify-start gap-2">
                <Mail className="h-4 w-4 text-accent" /> rajuranjanxbkj@gmail.com
              </p>
              <p className="flex items-center justify-center lg:justify-start gap-2">
                <Globe className="h-4 w-4 text-accent" /> www.nitsri.ac.in
              </p>
            </div>
          </div>

          {/* Divider (Desktop) */}
          <div className="hidden lg:block lg:col-span-1 border-r border-white/10 my-4 h-full mx-auto" />

          {/* Middle Columns: Links (Removed Portals) */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <h3 className="text-lg font-headline font-bold border-b border-primary/30 pb-2 w-fit">Explore Portal</h3>
              <ul className="space-y-4 text-sm font-medium opacity-70">
                <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 transition-transform">About CampusNotes</Link></li>
                <li><Link href="/forum" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 transition-transform">Student Community</Link></li>
                <li><Link href="/browse" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 transition-transform">Browse Repository</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-2 hover:translate-x-1 transition-transform">Contact Support</Link></li>
                <li><a href="https://nitsri.ac.in" target="_blank" className="hover:text-primary transition-colors flex items-center gap-1 hover:translate-x-1 transition-transform">Official NIT Website <ExternalLink className="h-3 w-3" /></a></li>
              </ul>
            </div>
          </div>

          {/* Right Column: Widgets */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-end gap-10">
            <div className="w-full max-w-[240px] p-3 border border-dashed border-primary/20 rounded-xl text-center bg-primary/5">
               <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Srinagar Air Quality Index : 42</span>
            </div>

            <div className="space-y-4 w-full flex flex-col items-center lg:items-end">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-60">Platform Feedback</h3>
              <Link href="/contact">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-primary/20">
                  <MessageSquare className="h-4 w-4" /> Share Feedback
                </button>
              </Link>
            </div>

            <div className="space-y-4 w-full flex flex-col items-center lg:items-end">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-60">Visitor Counter :</h3>
              <div className="flex gap-1">
                {visitorCount.split('').map((digit, i) => (
                  <span key={i} className="bg-white/5 border border-white/10 h-10 w-8 flex items-center justify-center rounded-lg font-mono text-xl font-black text-primary shadow-inner">
                    {digit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Logos Bar - Darker theme */}
      <div className="bg-secondary/50 py-8 overflow-hidden border-b border-white/5">
        <div className="container mx-auto flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          <div className="h-10 w-32 relative"><Image src="https://placehold.co/200x60/transparent/ffffff?text=Samarth+eGov" alt="Partner" fill className="object-contain" unoptimized /></div>
          <div className="h-10 w-32 relative"><Image src="https://placehold.co/200x60/transparent/ffffff?text=DigiLocker" alt="Partner" fill className="object-contain" unoptimized /></div>
          <div className="h-10 w-32 relative"><Image src="https://placehold.co/200x60/transparent/ffffff?text=india.gov.in" alt="Partner" fill className="object-contain" unoptimized /></div>
          <div className="h-10 w-32 relative"><Image src="https://placehold.co/200x60/transparent/ffffff?text=STUDY+IN+INDIA" alt="Partner" fill className="object-contain" unoptimized /></div>
          
          <div className="flex items-center gap-4 ml-4">
             <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] text-white outline-none focus:ring-1 focus:ring-primary/40">
                <option value="en">English (Portal)</option>
                <option value="hi">Hindi</option>
                <option value="ur">Urdu</option>
             </select>
             <span className="text-[10px] opacity-40 font-bold uppercase tracking-tighter">Powered by CampusNotes</span>
          </div>
        </div>
      </div>

      {/* Final Bottom Bar */}
      <div className="bg-background text-muted-foreground py-6 px-4 text-[10px] font-bold uppercase tracking-widest">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-4 text-center lg:text-left">
          <div className="flex flex-wrap justify-center items-center gap-4">
            <span className="text-foreground">Copyrights © National Institute of Technology Srinagar</span>
            <span className="opacity-20 hidden md:block">|</span>
            <span>All rights Reserved</span>
            <span className="opacity-20 hidden md:block">|</span>
            <Link href="/about" className="hover:text-primary transition-colors">Credits & Attributions</Link>
          </div>
          <div className="w-full lg:w-auto text-primary/60">
            <span>Built by the Student Community of NIT Srinagar</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

