'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center gap-6 min-h-[60vh] animate-in fade-in duration-500">
          <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center border border-destructive/20 text-destructive animate-bounce">
            <AlertCircle className="h-10 w-10" />
          </div>
          
          <div className="space-y-2 max-w-md">
            <h1 className="text-3xl font-headline font-bold text-destructive">Something went wrong</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              An unexpected error occurred while loading this page. Our team has been notified.
            </p>
            {this.state.error && (
              <pre className="mt-4 p-4 bg-zinc-900 border border-white/5 rounded-xl text-left text-xs font-mono text-red-400 overflow-x-auto max-w-full">
                {this.state.error.message}
              </pre>
            )}
          </div>

          <div className="flex gap-4">
            <Button onClick={this.handleReset} className="rounded-full px-6 h-11 font-bold">
              <RotateCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            <Button variant="outline" asChild className="rounded-full px-6 h-11 font-bold border-white/10">
              <Link href="/browse">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
              </Link>
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
