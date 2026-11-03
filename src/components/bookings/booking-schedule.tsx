'use client';

import { useState, useSyncExternalStore } from 'react';
import { CalendarDays, Clock3, Trash2 } from 'lucide-react';

import type { Booking, BookingActionResult } from '@/lib/bookings/types';
import { BookingDialog } from '@/components/bookings/booking-dialog';
import { Button } from '@/components/ui/button';

type BookingScheduleProps = {
  bookings: Booking[];
  errorMessage?: string;
  roomName: string;
  isAdmin: boolean;
  updateBookingAction: (bookingId: string, formData: FormData) => Promise<BookingActionResult>;
  deleteBookingAction: (bookingId: string) => Promise<BookingActionResult>;
};

const subscribe = () => () => {};
const getTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
const getServerTimeZone = () => 'UTC';

export function BookingSchedule({
  bookings,
  errorMessage,
  roomName,
  isAdmin,
  updateBookingAction,
  deleteBookingAction,
}: BookingScheduleProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');

  const timeZone = useSyncExternalStore(subscribe, getTimeZone, getServerTimeZone);

  async function handleDeleteBooking(bookingId: string) {
    setDeleteError('');
    setDeletingId(bookingId);
    try {
      const result = await deleteBookingAction(bookingId);
      if (!result.success) setDeleteError(result.message ?? 'Не вдалося видалити бронювання.');
    } catch {
      setDeleteError('Не вдалося видалити бронювання. Спробуйте ще раз.');
    } finally {
      setDeletingId(null);
    }
  }

  if (errorMessage) {
    return (
      <p role="alert" className="mt-6 rounded-xl border border-red-200 p-6 text-sm text-red-700">
        {errorMessage}
      </p>
    );
  }

  const dateFormat = new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  });
  const timeFormat = new Intl.DateTimeFormat('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone,
  });

  return (
    <div className="mt-6">
      <p className="text-muted-foreground mb-4 text-xs">Часовий пояс: {timeZone}</p>
      {deleteError && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          {deleteError}
        </p>
      )}
      {!bookings.length && (
        <div className="flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center">
          <span className="bg-muted mb-5 flex size-12 items-center justify-center rounded-xl">
            <CalendarDays className="text-muted-foreground size-6" aria-hidden="true" />
          </span>
          <p className="text-muted-foreground max-w-sm text-sm leading-6">
            У цій кімнаті ще немає бронювань. Натисніть «Забронювати», щоб додати зустріч.
          </p>
        </div>
      )}
      <ul aria-label="Бронювання кімнати" className="space-y-3">
        {bookings.map((booking) => {
          const start = new Date(booking.start_at);
          const end = new Date(booking.end_at);
          const startDate = dateFormat.format(start);
          const endDate = dateFormat.format(end);

          return (
            <li key={booking.id} className="rounded-xl border p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <h3 className="flex items-center gap-2 text-sm font-medium">
                  <CalendarDays className="size-4 shrink-0 text-emerald-700" aria-hidden="true" />
                  {startDate}
                </h3>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Clock3 className="size-4 shrink-0" aria-hidden="true" />
                  <span>
                    <time dateTime={booking.start_at}>{timeFormat.format(start)}</time>
                    {' — '}
                    <time dateTime={booking.end_at}>
                      {startDate !== endDate && `${endDate}, `}
                      {timeFormat.format(end)}
                    </time>
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground mt-3 text-sm leading-6 break-words whitespace-pre-wrap">
                {booking.description || 'Без опису'}
              </p>
              <p className="text-muted-foreground mt-3 text-xs break-words">
                Бронює: {booking.author_name}
              </p>
              {isAdmin && (
                <div className="mt-4 flex flex-wrap items-start gap-2 border-t pt-4">
                  <BookingDialog
                    booking={booking}
                    roomName={roomName}
                    bookingAction={updateBookingAction.bind(null, booking.id)}
                  />
                  <form action={() => handleDeleteBooking(booking.id)}>
                    <Button
                      type="submit"
                      variant="outline"
                      className="h-10 text-red-700 hover:text-red-800"
                      disabled={deletingId !== null}
                    >
                      <Trash2 aria-hidden="true" />
                      {deletingId === booking.id ? 'Скасовуємо…' : 'Скасувати'}
                    </Button>
                  </form>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
