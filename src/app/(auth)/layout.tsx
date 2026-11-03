import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Brand } from '@/components/brand';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Brand />
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 rounded-sm text-sm outline-offset-4 transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          На головну
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-12 sm:py-16">
        {children}
      </main>
      <footer className="text-muted-foreground pb-7 text-center text-xs">
        mrBooking · Простір для вашої команди
      </footer>
    </div>
  );
}
