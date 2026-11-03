'use client';

import { useId, useState, type ChangeEvent } from 'react';
import { CalendarPlus, Pencil } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { localDateTimeToIso } from '@/lib/bookings/time';
import type { Booking, BookingActionResult } from '@/lib/bookings/types';

type BookingDialogProps = {
  roomName: string;
  booking?: Booking;
  bookingAction: (formData: FormData) => Promise<BookingActionResult>;
};

const emptyForm = { date: '', start_time: '', end_time: '', description: '' };

function localFields(timestamp: string) {
  const date = new Date(timestamp);
  const pad = (value: number) => String(value).padStart(2, '0');
  return {
    date: `${String(date.getFullYear()).padStart(4, '0')}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

export function BookingDialog({ roomName, booking, bookingAction }: BookingDialogProps) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  async function handleBooking(formData: FormData) {
    setFormError('');

    const date = formData.get('date');
    const startTime = formData.get('start_time');
    const endTime = formData.get('end_time');
    if (typeof date !== 'string' || typeof startTime !== 'string' || typeof endTime !== 'string') {
      setFormError('Оберіть дату й час.');
      return;
    }

    const startAt = localDateTimeToIso(date, startTime);
    const endAt = localDateTimeToIso(date, endTime);
    if (!startAt || !endAt) {
      setFormError('Оберіть коректну дату й час у вашому часовому поясі.');
      return;
    }
    if (endAt <= startAt) {
      setFormError('Час завершення має бути пізніше часу початку.');
      return;
    }

    formData.set('start_at', startAt);
    formData.set('end_at', endAt);
    setIsSubmitting(true);

    try {
      const result = await bookingAction(formData);
      if (!result.success) {
        setFormError(result.message ?? 'Не вдалося зберегти бронювання.');
        return;
      }

      setOpen(false);
      setFormValues(emptyForm);
      setSuccessMessage(booking ? 'Бронювання змінено.' : 'Бронювання створено.');
    } catch {
      setFormError('Не вдалося зберегти бронювання. Перевірте з’єднання та спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isSubmitting) return;
        setOpen(nextOpen);
        setFormError('');
        setSuccessMessage('');
        if (nextOpen && booking) {
          const start = localFields(booking.start_at);
          const end = localFields(booking.end_at);
          setFormValues({
            date: start.date,
            start_time: start.time,
            end_time: end.time,
            description: booking.description ?? '',
          });
        } else {
          setFormValues(emptyForm);
        }
      }}
    >
      <div className="flex flex-col items-start gap-2 sm:items-end">
        <DialogTrigger asChild>
          <Button variant={booking ? 'outline' : 'default'} className="h-10 px-4">
            {booking ? <Pencil aria-hidden="true" /> : <CalendarPlus aria-hidden="true" />}
            {booking ? 'Редагувати' : 'Забронювати'}
          </Button>
        </DialogTrigger>
        {successMessage && (
          <p role="status" className="text-sm text-emerald-700">
            {successMessage}
          </p>
        )}
      </div>
      <DialogContent
        className="max-h-[calc(100svh-2rem)] overflow-y-auto p-6 sm:max-w-md"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {booking ? 'Редагування бронювання' : 'Нове бронювання'}
          </DialogTitle>
          <DialogDescription className="break-words">
            Оберіть дату й час зустрічі в кімнаті «{roomName}».
          </DialogDescription>
        </DialogHeader>
        <form
          action={handleBooking}
          className="mt-2 space-y-5"
          aria-busy={isSubmitting}
          aria-describedby={`${formId}-timezone`}
        >
          <div className="space-y-2">
            <Label htmlFor={`${formId}-date`}>Дата</Label>
            <Input
              id={`${formId}-date`}
              name="date"
              type="date"
              className="h-11 px-3"
              required
              value={formValues.date}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${formId}-start`}>Час початку</Label>
              <Input
                id={`${formId}-start`}
                name="start_time"
                type="time"
                className="h-11 px-3"
                required
                value={formValues.start_time}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${formId}-end`}>Час завершення</Label>
              <Input
                id={`${formId}-end`}
                name="end_time"
                type="time"
                className="h-11 px-3"
                required
                value={formValues.end_time}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${formId}-description`}>
              Опис <span className="text-muted-foreground font-normal">(необов’язково)</span>
            </Label>
            <textarea
              id={`${formId}-description`}
              name="description"
              rows={4}
              maxLength={1000}
              value={formValues.description}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Наприклад, обговорення задач команди"
              className="bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full resize-y rounded-lg border px-3 py-2.5 text-sm outline-none focus-visible:ring-3"
            />
          </div>
          <p id={`${formId}-timezone`} className="text-muted-foreground text-xs">
            Час вказується у вашому часовому поясі.
          </p>
          {formError && (
            <p role="alert" className="text-sm text-red-700">
              {formError}
            </p>
          )}
          <div className="flex justify-end gap-2 border-t pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="h-10 px-4" disabled={isSubmitting}>
                Закрити
              </Button>
            </DialogClose>
            <Button type="submit" className="h-10 px-4" disabled={isSubmitting}>
              {isSubmitting ? 'Зберігаємо…' : booking ? 'Зберегти зміни' : 'Забронювати'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
