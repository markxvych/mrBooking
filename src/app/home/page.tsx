import type { Metadata } from 'next';
import { HomeDashboard } from '@/components/home/home-dashboard';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Головна | mrBooking' };

export  default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }


  return <HomeDashboard />;
}
