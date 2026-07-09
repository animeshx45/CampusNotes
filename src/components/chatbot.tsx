"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Bot, GraduationCap } from 'lucide-react';
import { campusAssistant } from '@/ai/flows/campus-chatbot-flow';
import { cn } from '@/lib/utils';

// Helper component to parse and render simple markdown elements
function MarkdownRenderer({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let inList = false;

  const formatInline = (str: string) => {
    const parts: React.ReactNode[] = [];
    let i = 0;
    while (i < str.length) {
      if (str.startsWith('**', i)) {
        const endBold = str.indexOf('**', i + 2);
        if (endBold !== -1) {
          parts.push(<strong key={`b-${i}`} className="font-bold text-foreground">{str.slice(i + 2, endBold)}</strong>);
          i = endBold + 2;
          continue;
        }
      }
      if (str.startsWith('`', i)) {
        const endCode = str.indexOf('`', i + 1);
        if (endCode !== -1) {
          parts.push(<code key={`c-${i}`} className="bg-primary/10 text-primary dark:text-primary-foreground font-mono px-1 rounded text-[11px] font-semibold">{str.slice(i + 1, endCode)}</code>);
          i = endCode + 1;
          continue;
        }
      }
      parts.push(str[i]);
      i++;
    }
    return parts;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('###')) {
      if (inList) {
        elements.push(<ul key={`ul-${idx}`} className="list-disc pl-4 space-y-1 my-1.5">{[...listItems]}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<h4 key={idx} className="text-xs font-black uppercase tracking-wider text-primary mt-3 mb-1">{formatInline(trimmed.slice(3).trim())}</h4>);
    } else if (trimmed.startsWith('##')) {
      if (inList) {
        elements.push(<ul key={`ul-${idx}`} className="list-disc pl-4 space-y-1 my-1.5">{[...listItems]}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<h3 key={idx} className="text-sm font-black text-primary mt-4 mb-1.5">{formatInline(trimmed.slice(2).trim())}</h3>);
    } else if (trimmed.startsWith('#')) {
      if (inList) {
        elements.push(<ul key={`ul-${idx}`} className="list-disc pl-4 space-y-1 my-1.5">{[...listItems]}</ul>);
        listItems = [];
        inList = false;
      }
      elements.push(<h2 key={idx} className="text-base font-black text-foreground mt-4 mb-2">{formatInline(trimmed.slice(1).trim())}</h2>);
    } else if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      inList = true;
      listItems.push(<li key={idx} className="text-xs font-medium leading-relaxed my-0.5">{formatInline(trimmed.slice(1).trim())}</li>);
    } else {
      if (inList) {
        elements.push(<ul key={`ul-${idx}`} className="list-disc pl-4 space-y-1 my-1.5">{[...listItems]}</ul>);
        listItems = [];
        inList = false;
      }
      if (trimmed) {
        elements.push(<p key={idx} className="text-xs leading-relaxed my-1">{formatInline(trimmed)}</p>);
      }
    }
  });

  if (inList) {
    elements.push(<ul key="ul-end" className="list-disc pl-4 space-y-1 my-1.5">{[...listItems]}</ul>);
  }

  return <div className="space-y-0.5">{elements}</div>;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'model', content: "Hi! 👋 I'm your Campus Assistant. Ask me anything about notes or course curriculum topics! 📚" }]);
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
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having a bit of trouble. Please try again in a moment! 😅" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
      {isOpen && (
        <Card className="w-[300px] sm:w-[350px] h-[450px] shadow-2xl flex flex-col overflow-hidden border border-white/10 bg-zinc-950/90 backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-300 rounded-[2rem]">
          <CardHeader className="bg-gradient-to-r from-primary to-accent text-primary-foreground p-4 flex flex-row items-center justify-between relative border-b border-white/5">
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 p-2 rounded-xl">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-sm font-bold tracking-tight">Study Assistant</CardTitle>
                <span className="text-[9px] font-bold opacity-80 uppercase tracking-widest">Live Help</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-white/10 rounded-full h-8 w-8"><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="flex-grow p-0 overflow-hidden bg-background/50">
            <ScrollArea className="h-full p-4" ref={scrollRef}>
              <div className="flex flex-col gap-4">
                {messages.map((m, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "p-3 text-xs max-w-[85%] shadow-sm transition-all duration-300",
                      m.role === 'user' 
                        ? "ml-auto bg-primary text-primary-foreground rounded-[1.25rem] rounded-tr-sm" 
                        : "bg-muted/80 backdrop-blur-sm border border-primary/5 text-foreground rounded-[1.25rem] rounded-tl-sm"
                    )}
                  >
                    {m.role === 'model' ? (
                      <MarkdownRenderer text={m.content} />
                    ) : (
                      m.content
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-primary animate-pulse px-2">
                    <div className="flex gap-1">
                      <span className="h-1 w-1 rounded-full bg-primary animate-bounce" />
                      <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.1s]" />
                      <span className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.2s]" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Thinking...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t border-white/5 bg-card/60">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2 items-center">
              <Input 
                placeholder="Ask about a study topic..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                className="bg-secondary/40 border-none rounded-xl h-10 text-xs focus-visible:ring-1 focus-visible:ring-primary/20" 
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !input.trim()}
                className="rounded-xl h-10 w-10 shrink-0"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
      <Button 
        size="lg" 
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-all border border-white/10 hover:scale-105 duration-300",
          isOpen ? "bg-card text-primary" : "bg-primary text-primary-foreground"
        )} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </div>
  );
}
