
"use client";

import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast({ 
        title: "Missing Fields", 
        description: "Please fill in all details before sending.", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);
    try {
      await addDocumentNonBlocking(collection(db, 'contactMessages'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      toast({ 
        title: "Message Sent!", 
        description: "We've received your query and will get back to you soon." 
      });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to send message. Please try again later.", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-primary tracking-tighter">Thank You!</h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Your message has been delivered to the CampusNotes team. We'll reach out to <strong>{formData.email}</strong> if required.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsSuccess(false)} 
          className="rounded-xl px-8 h-12 border-primary/20"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl space-y-16 animate-in fade-in duration-500">
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary tracking-tighter">Contact <span className="text-foreground italic">Us.</span></h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
          Have questions or want to report an issue? We're here to help the NIT Srinagar community.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-6 bg-secondary/20 rounded-[2rem] border border-primary/5 hover:border-primary/20 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p className="text-muted-foreground">rajuranjanxbkj@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-secondary/20 rounded-[2rem] border border-primary/5 hover:border-primary/20 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Address</h3>
                  <p className="text-muted-foreground">National Institute of Technology, Hazratbal, Srinagar, J&K</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-secondary/20 rounded-[2rem] border border-primary/5 hover:border-primary/20 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Phone</h3>
                  <p className="text-muted-foreground">+91 9693929816</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden bg-card border border-primary/5">
          <CardHeader className="bg-primary text-primary-foreground p-8">
            <CardTitle className="text-2xl font-headline font-bold">Send a Message</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Full Name</label>
                <Input 
                  placeholder="Full Name" 
                  className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                <Input 
                  type="email"
                  placeholder="email@nitsri.ac.in" 
                  className="rounded-xl h-12 bg-secondary/20 border-none shadow-inner" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Your Message</label>
                <Textarea 
                  placeholder="How can we help you today?" 
                  className="rounded-2xl min-h-[150px] bg-secondary/20 border-none shadow-inner p-4" 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-16 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
