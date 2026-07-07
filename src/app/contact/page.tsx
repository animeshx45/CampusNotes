
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl space-y-16">
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Have questions or want to report an issue? We're here to help the NIT Srinagar community.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-6 bg-secondary/20 rounded-2xl border border-primary/5">
                <Mail className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p className="text-muted-foreground">rajuranjanxbkj@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-secondary/20 rounded-2xl border border-primary/5">
                <MapPin className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold">Address</h3>
                  <p className="text-muted-foreground">National Institute of Technology, Hazratbal, Srinagar, J&K</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-secondary/20 rounded-2xl border border-primary/5">
                <Phone className="h-6 w-6 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold">Support</h3>
                  <p className="text-muted-foreground">Student-run initiative for peer support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="rounded-[2.5rem] border-primary/10 shadow-xl overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-8">
            <CardTitle>Send a Message</CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your Name</label>
              <Input placeholder="Full Name" className="rounded-xl h-12" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
              <Input placeholder="email@nitsri.ac.in" className="rounded-xl h-12" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Message</label>
              <Textarea placeholder="How can we help you?" className="rounded-xl min-h-[150px]" />
            </div>
            <Button className="w-full h-14 rounded-xl font-bold text-lg gap-2 shadow-lg">
              <Send className="h-5 w-5" /> Send Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
