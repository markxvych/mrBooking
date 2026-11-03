import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'mrBooking',
  description: 'Бронювання переговорних кімнат',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
