
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, X, Send, Loader2, Bot } from 'lucide-react';
import { campusChatbot } from '@/ai/flows/campus-chatbot-flow';
import { cn } from '@/lib/utils';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'model', content: "Hi there! 👋 I'm your CampusNotes Assistant. How can I help you excel at NIT Srinagar today? 🎓" }]);
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
      const res = await campusChatbot({ prompt: userMsg, history: messages.map(m => ({ role: m.role as any, content: m.content })) });
      setMessages(prev => [...prev, { role: 'model', content: res.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error. Please try again. 😅" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
      {isOpen && (
        <Card className="w-[350px] sm:w-[400px] h-[500px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4">
          <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2"><Bot className="h-5 w-5" /><CardTitle className="text-sm">CampusNotes AI 🤖</CardTitle></div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-white/10"><X className="h-5 w-5" /></Button>
          </CardHeader>
          <CardContent className="flex-grow p-0 overflow-hidden bg-secondary/30">
            <ScrollArea className="h-full p-4" ref={scrollRef}>
              <div className="flex flex-col gap-4">
                {messages.map((m, i) => (
                  <div key={i} className={cn("p-3 rounded-2xl text-sm max-w-[85%]", m.role === 'user' ? "ml-auto bg-primary text-primary-foreground rounded-tr-none" : "bg-white border rounded-tl-none")}>
                    {m.content}
                  </div>
                ))}
                {isLoading && <div className="flex items-center gap-2 text-muted-foreground animate-pulse px-2"><Loader2 className="h-4 w-4 animate-spin" /><span className="text-xs">Thinking... 🤔</span></div>}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t bg-white">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex w-full gap-2">
              <Input placeholder="Ask anything..." value={input} onChange={(e) => setInput(e.target.value)} className="bg-secondary/50 border-none" />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}><Send className="h-4 w-4" /></Button>
            </form>
          </CardFooter>
        </Card>
      )}
      <Button size="lg" className="h-14 w-14 rounded-full shadow-2xl" onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}</Button>
    </div>
  );
}
