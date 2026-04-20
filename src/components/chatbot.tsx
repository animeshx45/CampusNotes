"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Loader2, Bot, GraduationCap } from 'lucide-react';
import { campusChatbot } from '@/ai/flows/campus-chatbot-flow';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Hi there! 👋 I\'m your CampusNotes Assistant. How can I help you excel at NIT Srinagar today? 🎓' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await campusChatbot({
        prompt: userMessage,
        history: messages.map(m => ({
          role: m.role === 'model' ? 'model' : 'user',
          content: m.content
        }))
      });

      setMessages(prev => [...prev, { role: 'model', content: response.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again. 😅' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
      {isOpen && (
        <Card className="w-[350px] sm:w-[400px] h-[500px] shadow-2xl border-primary/20 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-sm font-headline font-bold">CampusNotes AI 🤖</CardTitle>
                <p className="text-[10px] text-primary-foreground/70 uppercase tracking-widest font-bold">NIT Srinagar Guide</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-white/10" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          
          <CardContent className="flex-grow p-0 overflow-hidden bg-secondary/30">
            <ScrollArea className="h-full p-4" ref={scrollRef}>
              <div className="flex flex-col gap-4">
                {messages.map((m, i) => (
                  <div key={i} className={cn("flex flex-col max-w-[85%]", m.role === 'user' ? "ml-auto items-end" : "items-start")}>
                    <div className={cn(
                      "p-3 rounded-2xl text-sm shadow-sm",
                      m.role === 'user' 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-white dark:bg-card border rounded-tl-none"
                    )}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground animate-pulse px-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs font-medium">Assistant is thinking... 🤔</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-3 border-t shrink-0 bg-white dark:bg-card">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex w-full gap-2"
            >
              <Input 
                placeholder="Ask about departments or notes..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="bg-secondary/50 border-none rounded-xl text-sm"
              />
              <Button type="submit" size="icon" className="rounded-xl shrink-0" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      <Button 
        size="lg" 
        className={cn(
          "h-14 w-14 rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95",
          isOpen ? "bg-destructive hover:bg-destructive" : "bg-primary"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </div>
  );
}
