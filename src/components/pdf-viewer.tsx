"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2, 
  Download, Loader2, AlertCircle, HelpCircle, Eye, Sliders, Settings2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PDFViewerProps {
  url: string;
  title?: string;
}

const PDF_JS_VERSION = '3.4.120';
const PDF_JS_CDN = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.min.js`;
const PDF_WORKER_CDN = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.worker.min.js`;

export default function PDFViewer({ url, title }: PDFViewerProps) {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const [libLoaded, setLibLoaded] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [activePage, setActivePage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load PDF.js engine
  useEffect(() => {
    let isMounted = true;
    const loadLibrary = async () => {
      try {
        if (!(window as any).pdfjsLib) {
          const script = document.createElement('script');
          script.src = PDF_JS_CDN;
          script.async = true;
          
          const scriptPromise = new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load PDF.js engine. Please check your connection.'));
          });
          
          document.head.appendChild(script);
          await scriptPromise;
        }

        if (isMounted) {
          const pdfjsLib = (window as any).pdfjsLib;
          pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_CDN;
          setLibLoaded(true);
        }
      } catch (err: any) {
        console.error('PDF.js script load error:', err);
        if (isMounted) {
          setError('Failed to initialize PDF Viewer Engine. Direct download is still active.');
          setIsLoading(false);
        }
      }
    };

    loadLibrary();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch and load PDF
  useEffect(() => {
    if (!libLoaded || !url) return;

    let isMounted = true;
    let docInstance: any = null;

    const loadDocument = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const isRelative = !url.startsWith('http://') && !url.startsWith('https://');
        const loadUrl = isRelative ? url : `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
        const pdfjsLib = (window as any).pdfjsLib;
        
        const loadingTask = pdfjsLib.getDocument(loadUrl);
        docInstance = await loadingTask.promise;
        
        if (isMounted) {
          setPdfDoc(docInstance);
          setNumPages(docInstance.numPages);
          setActivePage(1);
        }
      } catch (err: any) {
        console.error('Error loading PDF:', err);
        if (isMounted) {
          setError('Unable to load PDF file. The file may be corrupt or inaccessible.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDocument();

    return () => {
      isMounted = false;
      if (docInstance) {
        docInstance.destroy();
      }
    };
  }, [libLoaded, url]);

  // Sync fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handlePageVisible = useCallback((pageNum: number) => {
    setActivePage(pageNum);
  }, []);

  const scrollToPage = (pageNum: number) => {
    const targetPageEl = pageRefs.current[pageNum];
    if (targetPageEl && scrollAreaRef.current) {
      targetPageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToPrevPage = () => {
    if (activePage > 1) {
      scrollToPage(activePage - 1);
    }
  };

  const goToNextPage = () => {
    if (activePage < numPages) {
      scrollToPage(activePage + 1);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.15, 2.5));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.15, 0.6));
  };

  const fitToWidth = () => {
    if (!pdfDoc || !scrollAreaRef.current) return;
    pdfDoc.getPage(activePage).then((page: any) => {
      const viewport = page.getViewport({ scale: 1.0 });
      const targetWidth = scrollAreaRef.current!.clientWidth - 96; // padding offsets
      const newScale = targetWidth / viewport.width;
      setScale(Math.max(0.6, Math.min(newScale, 2.0)));
      toast({ title: "Page Fitted", description: `Scale adjusted to ${Math.round(newScale * 100)}%` });
    });
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const downloadFile = async () => {
    if (!url) return;
    try {
      setIsDownloading(true);
      const isRelative = !url.startsWith('http://') && !url.startsWith('https://');
      const fetchUrl = isRelative ? url : `/api/pdf-proxy?url=${encodeURIComponent(url)}`;
      const response = await fetch(fetchUrl);
      if (!response.ok) throw new Error('File download proxy failed.');
      
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error('Retrieved content is HTML instead of PDF. The file may have expired or is inaccessible.');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      const formattedTitle = title ? title.replace(/[^a-z0-9]/gi, '_') : 'study_material';
      link.download = `${formattedTitle}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast({
        title: "Download complete!",
        description: "File successfully saved to your device.",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Direct download failed",
        description: "Opening document link in a new tab.",
        variant: "destructive",
      });
      window.open(url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      goToNextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      goToPrevPage();
    }
  };

  const blueprintGridStyle = {
    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
    backgroundSize: '32px 32px',
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center gap-4 bg-muted/5 border border-primary/10 rounded-[2.5rem] p-8">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-headline font-bold text-sm tracking-wider animate-pulse">
          LOAD-IN PROGRESS...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center gap-6 bg-destructive/5 border border-destructive/20 rounded-[2.5rem] p-8 text-center">
        <AlertCircle className="h-12 w-12 text-destructive animate-bounce" />
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-destructive">Unable to Render PDF</h3>
          <p className="text-sm text-muted-foreground max-w-md">{error}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="default" className="rounded-full px-6 font-bold" onClick={downloadFile} disabled={isDownloading}>
            {isDownloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
            Download Document
          </Button>
          <Button variant="outline" className="rounded-full px-6 font-bold" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">Open in New Tab</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={cn(
        "relative w-full flex flex-col items-center bg-zinc-950 text-white outline-none overflow-hidden select-none transition-all shadow-[0_30px_100px_rgba(0,0,0,0.8)] border border-white/5",
        isFullscreen ? "h-screen rounded-none" : "h-[900px] rounded-[2.5rem]"
      )}
    >
      {/* Decorative radial blur glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Modern docked top toolbar combining study mode info and full controls */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-white/5 bg-zinc-900/80 backdrop-blur-md z-20 sticky top-0 shadow-md">
        {/* Left: Study Title Info */}
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase hidden sm:block">
            STUDY HUB
          </span>
          <span className="text-xs font-bold text-zinc-200 line-clamp-1 max-w-[150px] md:max-w-[220px]">
            {title || "Document"}
          </span>
        </div>

        {/* Center: Integrated PDF controls */}
        <div className="flex items-center gap-2 bg-zinc-950/50 border border-white/10 px-3 py-1 rounded-full text-zinc-300">
          {/* Navigation Section */}
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full hover:bg-white/10 hover:text-white disabled:opacity-30"
              onClick={goToPrevPage} 
              disabled={activePage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-bold text-zinc-300 min-w-[50px] text-center">
              {activePage} / {numPages}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full hover:bg-white/10 hover:text-white disabled:opacity-30"
              onClick={goToNextPage} 
              disabled={activePage >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-4 w-[1px] bg-white/10 mx-1" />

          {/* Zoom Section */}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full hover:bg-white/10 hover:text-white text-zinc-400"
              onClick={zoomOut} 
              disabled={scale <= 0.6}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-[10px] font-black font-mono w-10 text-center text-zinc-300">
              {Math.round(scale * 100)}%
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full hover:bg-white/10 hover:text-white text-zinc-400"
              onClick={zoomIn} 
              disabled={scale >= 2.5}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              className="h-7 rounded-full text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/10 px-2"
              onClick={fitToWidth}
            >
              Fit Width
            </Button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-white/10 hover:text-white text-zinc-400"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-8 rounded-full text-xs font-black bg-white text-black hover:bg-zinc-200 shadow-lg px-4"
            onClick={downloadFile}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Download className="h-3 w-3 mr-1" />
            )}
            SAVE
          </Button>
        </div>
      </div>

      {/* Main scrolling workspace with technical blueprint grid pattern */}
      <div 
        ref={scrollAreaRef}
        style={blueprintGridStyle}
        className={cn(
          "flex-1 w-full overflow-y-auto flex flex-col items-center gap-10 py-12 px-8 bg-zinc-950/80 text-zinc-400 scroll-smooth",
          isFullscreen ? "max-h-[calc(100vh-80px)]" : "max-h-[calc(900px-80px)]"
        )}
      >
        {Array.from({ length: numPages }).map((_, i) => {
          const pageNum = i + 1;
          return (
            <div 
              key={pageNum}
              ref={el => { pageRefs.current[pageNum] = el; }}
              className="w-full flex justify-center relative group"
            >
              {/* Floating page tag */}
              <div className="absolute left-4 top-2 text-[10px] font-bold tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors pointer-events-none select-none">
                PAGE {pageNum}
              </div>
              <PDFPage 
                pdfDoc={pdfDoc}
                pageNum={pageNum}
                scale={scale}
                onVisible={handlePageVisible}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --- Sub-component to lazy render a single page --- */
interface PDFPageProps {
  pdfDoc: any;
  pageNum: number;
  scale: number;
  onVisible: (pageNum: number) => void;
}

function PDFPage({ pdfDoc, pageNum, scale, onVisible }: PDFPageProps) {
  const pageContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  // Get dimensions initially
  useEffect(() => {
    let isMounted = true;
    pdfDoc.getPage(pageNum).then((page: any) => {
      if (!isMounted) return;
      const viewport = page.getViewport({ scale });
      setDimensions({ width: viewport.width, height: viewport.height });
    });
    return () => {
      isMounted = false;
    };
  }, [pdfDoc, pageNum, scale]);

  // Render method
  const renderPage = useCallback(async () => {
    if (!canvasRef.current) return;
    setIsRendering(true);

    try {
      const page = await pdfDoc.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      const viewport = page.getViewport({ scale });
      const pixelRatio = window.devicePixelRatio || 1;

      canvas.width = viewport.width * pixelRatio;
      canvas.height = viewport.height * pixelRatio;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      context.scale(pixelRatio, pixelRatio);

      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }

      renderTaskRef.current = page.render({
        canvasContext: context,
        viewport,
      });

      await renderTaskRef.current.promise;
      setIsRendered(true);
      renderTaskRef.current = null;
    } catch (err: any) {
      if (err.name !== 'RenderingCancelledException') {
        console.error(`Error rendering page ${pageNum}:`, err);
      }
    } finally {
      setIsRendering(false);
    }
  }, [pdfDoc, pageNum, scale]);

  // Scroll observer
  useEffect(() => {
    if (!pageContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onVisible(pageNum);
          if (!isRendered && !isRendering) {
            renderPage();
          }
        }
      },
      {
        root: null,
        rootMargin: '600px 0px 600px 0px', // Preload
        threshold: 0.1,
      }
    );

    observer.observe(pageContainerRef.current);
    return () => {
      observer.disconnect();
    };
  }, [isRendered, isRendering, onVisible, pageNum, renderPage]);

  // Handle zoom changes
  useEffect(() => {
    if (isRendered) {
      renderPage();
    }
  }, [scale, renderPage, isRendered]);

  return (
    <div 
      ref={pageContainerRef}
      className="relative flex justify-center bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-white/5 overflow-hidden transition-all duration-300 hover:scale-[1.005] hover:shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
      style={{
        width: dimensions ? `${dimensions.width}px` : 'auto',
        height: dimensions ? `${dimensions.height}px` : '550px',
        maxWidth: '100%',
        minHeight: '200px',
      }}
    >
      <canvas ref={canvasRef} className="block max-w-full" />
      {(!isRendered || isRendering) && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/60 backdrop-blur-[2px]">
          <Loader2 className="h-6 w-6 text-white animate-spin" />
        </div>
      )}
    </div>
  );
}
