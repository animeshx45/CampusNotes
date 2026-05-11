
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Loader2, Bot, Sparkles, GraduationCap } from 'lucide-react';
import { campusAssistant } from '@/ai/flows/campus-chatbot-flow';
import { cn } from '@/lib/utils';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'model', content: "Hello! 👋 I'm your CampusNotes Assistant. Need help finding study materials for NIT Srinagar? 📚" }]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);
    try {
      const res = await campusAssistant({ prompt: userMsg, history: messages.map(m => ({ role: m.role as any, content: m.content })) });
      setMessages(prev => [...prev, { role: 'model', content: res.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'model', content: "I'm having a bit of trouble connecting to the campus network. Please try again later! 😅" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
      {isOpen && (
        <Card className="w-[350px] sm:w-[400px] h-[550px] shadow-2xl flex flex-col overflow-hidden border-primary/20 animate-in slide-in-from-bottom-4 duration-300 rounded-[2rem]">
          <CardHeader className="bg-primary text-primary-foreground p-6 flex flex-row items-center justify-between border-b border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <GraduationCap className="h-12 w-12" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-sm font-headline font-bold">Campus AI</CardTitle>
                <span className="text-[10px] font-bold opacity-70 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Academic Support
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-white/10 rounded-full h-8 w-8"><X className="h-5 w-5" /></Button>
          </CardHeader>
          <CardContent className="flex-grow p-0 overflow-hidden bg-secondary/20 dark:bg-background">
            <ScrollArea className="h-full p-6" ref={scrollRef}>
              <div className="flex flex-col gap-6">
                {messages.map((m, i) => (
                  <div key={i} className={cn(
                    "p-4 rounded-2xl text-sm max-w-[85%] shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2",
                    m.role === 'user' 
                      ? "ml-auto bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-card border border-primary/10 rounded-tl-none text-foreground"
                  )}>
                    {m.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-primary animate-pulse px-2">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Studying...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t bg-card">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2 items-center">
              <Input 
                placeholder="Ask about branches, subjects, or notes..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                className="bg-secondary/50 border-none rounded-xl focus-visible:ring-primary h-11" 
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !input.trim()}
                className="rounded-xl h-11 w-11 shrink-0 shadow-lg shadow-primary/20"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
      <Button 
        size="lg" 
        className={cn(
          "h-16 w-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group",
          isOpen ? "bg-card text-primary border-primary/20" : "bg-primary text-primary-foreground"
        )} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-7 w-7" />
        ) : (
          <div className="relative">
             <MessageSquare className="h-7 w-7 group-hover:rotate-12 transition-transform" />
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
             </span>
          </div>
        )}
      </Button>
    </div>
  );
}
