import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Chatbot } from '@/components/chatbot';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'CampusNotes | NIT Srinagar Peer Study Portal',
  description: 'The ultimate peer-to-peer study resource platform dedicated to the students of National Institute of Technology, Srinagar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased flex flex-col min-h-screen overflow-x-hidden">
        <FirebaseClientProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              forcedTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <Navbar />
              <main className="flex-grow w-full overflow-x-hidden">
                {children}
              </main>
              <Footer />
              <Chatbot />
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
