
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Bot, GraduationCap } from 'lucide-react';
import { campusAssistant } from '@/ai/flows/campus-chatbot-flow';
import { cn } from '@/lib/utils';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'model', content: "Hi! 👋 I'm your Campus Assistant. How can I help you find notes today? 📚" }]);
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
        <Card className="w-[320px] sm:w-[380px] h-[500px] shadow-2xl flex flex-col overflow-hidden border-primary/20 animate-in slide-in-from-bottom-2 duration-300 rounded-[2rem]">
          <CardHeader className="bg-primary text-primary-foreground p-5 flex flex-row items-center justify-between relative">
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 p-2 rounded-xl">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-sm font-bold">Study Buddy</CardTitle>
                <span className="text-[10px] font-bold opacity-70">Always Online</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-white/10 rounded-full h-8 w-8"><X className="h-5 w-5" /></Button>
          </CardHeader>
          <CardContent className="flex-grow p-0 overflow-hidden bg-background">
            <ScrollArea className="h-full p-4" ref={scrollRef}>
              <div className="flex flex-col gap-4">
                {messages.map((m, i) => (
                  <div key={i} className={cn(
                    "p-3 rounded-xl text-sm max-w-[90%] shadow-sm",
                    m.role === 'user' 
                      ? "ml-auto bg-primary text-primary-foreground" 
                      : "bg-muted border border-primary/5 text-foreground"
                  )}>
                    {m.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-primary animate-pulse px-2">
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.1s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.2s]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase">Thinking...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t bg-card">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2 items-center">
              <Input 
                placeholder="Ask me anything..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                className="bg-secondary/50 border-none rounded-xl h-10" 
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !input.trim()}
                className="rounded-xl h-10 w-10 shrink-0"
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
          "h-14 w-14 rounded-full shadow-xl transition-all",
          isOpen ? "bg-card text-primary border-primary/20" : "bg-primary text-primary-foreground"
        )} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </div>
  );
}
