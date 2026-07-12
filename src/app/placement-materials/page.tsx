"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Briefcase, FolderOpen, FileText, ChevronRight, Download, Eye, 
  ArrowLeft, Loader2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PlacementMaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/placement-materials");
        const json = await res.json();
        setMaterials(json.data || []);
      } catch (err) {
        console.error("Failed to load placement materials", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20 w-full overflow-x-hidden gpu-smooth">
      <div className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
        {/* Navigation & Header */}
        <div className="space-y-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-white/5 pb-8">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-none rounded-full px-5 py-1.5 font-black tracking-[0.2em] text-[10px]">
                <Briefcase className="h-3.5 w-3.5 mr-1.5 inline" /> CAREER PREPARATION
              </Badge>
              <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-primary">
                Placement Materials.
              </h1>
              <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl leading-relaxed">
                Explore interview preparation kits, quantitative aptitude guides, coding cheatsheets, and company-specific resources curated for NIT Srinagar students.
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-bold uppercase tracking-widest text-xs text-muted-foreground">Loading Placement Kits...</p>
          </div>
        ) : materials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {materials.map((item) => (
              <Card 
                key={item.id} 
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] hover:-translate-y-2 hover:border-primary/50 hover:bg-white/10 hover:shadow-[0_30px_60px_-15px_rgba(22,163,74,0.15)] transition-all duration-500 flex flex-col justify-between h-full overflow-hidden group shadow-lg"
              >
                <CardContent className="p-8 space-y-6 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    {/* Icon & Type Badge */}
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20 shadow-inner group-hover:rotate-6 transition-transform">
                        <FolderOpen className="h-6 w-6" />
                      </div>
                      <Badge className="bg-white/5 border border-white/10 text-muted-foreground font-bold px-3 py-1 text-[10px] rounded-lg">
                        {item.folderFiles?.length || 0} Files
                      </Badge>
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold tracking-tight text-white group-hover:text-primary transition-colors line-clamp-1">
                        {item.title}
                      </h2>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Folder Contents Preview */}
                  {item.folderFiles && item.folderFiles.length > 0 && (
                    <div className="border-t border-white/5 pt-4 space-y-2.5">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Folder Contents:</p>
                      <div className="space-y-1.5">
                        {item.folderFiles.slice(0, 3).map((file: any, index: number) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 p-2 rounded-lg border border-white/5 truncate hover:text-white transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5 text-accent shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                        ))}
                        {item.folderFiles.length > 3 && (
                          <p className="text-[10px] text-muted-foreground italic pl-1">
                            + {item.folderFiles.length - 3} more files
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer Stats and Button */}
                  <div className="border-t border-white/5 pt-4 flex items-center justify-between mt-auto">
                    <div className="flex gap-4 text-xs font-semibold text-muted-foreground">
                      <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5 text-primary" /> {item.views}</span>
                      <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5 text-accent" /> {item.downloadCount}</span>
                    </div>

                    <Button 
                      asChild 
                      variant="ghost" 
                      size="sm" 
                      className="rounded-xl font-black text-xs uppercase tracking-widest text-primary hover:text-white hover:bg-primary gap-1 group/btn h-9 px-4 active:scale-95"
                    >
                      <Link href={`/material/${item.id}`}>
                        Open Kit <ChevronRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-6 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
            <Briefcase className="h-16 w-16 text-primary/20 mx-auto animate-pulse" />
            <div className="space-y-2">
              <p className="text-2xl font-bold tracking-tight text-primary">No Placement Kits Available</p>
              <p className="text-muted-foreground max-w-sm mx-auto text-sm">
                Stay tuned! Career preparation guides and resources will be uploaded soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
