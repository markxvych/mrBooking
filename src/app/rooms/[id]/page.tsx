import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, DoorOpen } from 'lucide-react';

import { getRoom } from '@/app/home/action';
import { Brand } from '@/components/brand';
import { BookingDialog } from '@/components/bookings/booking-dialog';
import { BookingSchedule } from '@/components/bookings/booking-schedule';
import { Button } from '@/components/ui/button';
import { addBooking, getBookings, updateBooking, deleteBooking } from './action';

export const metadata: Metadata = { title: 'Кімната | mrBooking' };

export default async function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { room, currentUserId } = await getRoom(id);
  const { bookings, errorMessage } = await getBookings(room.id);
  const isAdmin = room.owner_id === currentUserId;

  return (
    <div className="min-h-svh">
      <header className="bg-background border-b">
        <div className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Brand href="/home" />
          <Button asChild variant="ghost" className="h-10 px-3">
            <Link href="/home">
              <ArrowLeft aria-hidden="true" />
              Усі кімнати
            </Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="flex items-center gap-3">
          <DoorOpen className="size-5 text-emerald-700" aria-hidden="true" />
          <p className="text-sm font-medium text-emerald-700">Переговорна кімната</p>
          {isAdmin && (
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
              Admin
            </span>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight break-words sm:text-4xl">
          {room.name}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-7 break-words whitespace-pre-wrap">
          {room.description || 'Опис кімнати ще не додано.'}
        </p>
        <section className="mt-12" aria-labelledby="schedule-heading">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <h2 id="schedule-heading" className="text-lg font-medium">
              Розклад кімнати
            </h2>
            <BookingDialog roomName={room.name} bookingAction={addBooking.bind(null, room.id)} />
          </div>
          <BookingSchedule
            bookings={bookings}
            errorMessage={errorMessage}
            roomName={room.name}
            isAdmin={isAdmin}
            updateBookingAction={updateBooking.bind(null, room.id)}
            deleteBookingAction={deleteBooking.bind(null, room.id)}
          />
        </section>
      </main>
    </div>
  );
}
