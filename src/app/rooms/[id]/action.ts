'use server';

import { createClient } from '@/lib/supabase/server';
import { parseUtcTimestamp } from '@/lib/bookings/time';
import type { Booking, BookingActionResult } from '@/lib/bookings/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getRoom } from '@/app/home/action';

export async function getBookings(
  roomId: string,
): Promise<{ bookings: Booking[]; errorMessage?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) redirect('/login');

  const { data, error } = await supabase
    .from('bookings')
    .select('id, start_at, end_at, description, author:profiles!bookings_author_profile_fkey(name)')
    .eq('room_id', roomId)
    .eq('status', 'active')
    .order('start_at', { ascending: true })
    .order('id', { ascending: true })
    .returns<
      {
        id: string;
        start_at: string;
        end_at: string;
        description: string | null;
        author: { name: string } | null;
      }[]
    >();

  if (error) {
    console.error(error.code, error.message);
    return {
      bookings: [],
      errorMessage: 'Не вдалося завантажити розклад. Оновіть сторінку та спробуйте ще раз.',
    };
  }

  return {
    bookings: (data ?? []).map(({ author, ...booking }) => ({
      ...booking,
      author_name: author?.name ?? 'Користувач',
    })),
  };
}

export async function addBooking(roomId: string, formData: FormData): Promise<BookingActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: 'Увійдіть повторно, щоб створити бронювання.' };
  }

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roomId)) {
    return { success: false, message: 'Некоректний ID кімнати.' };
  }

  const fields = readBookingFields(formData);
  if (!fields.success) return fields;

  const { error: bookingError } = await supabase.from('bookings').insert({
    room_id: roomId,
    ...fields.values,
  });

  if (bookingError) return mutationError(bookingError);

  revalidatePath(`/rooms/${roomId}`);
  return { success: true };
}

function readBookingFields(
  formData: FormData,
):
  | { success: false; message: string }
  | { success: true; values: { start_at: string; end_at: string; description: string } } {
  const startAt = parseUtcTimestamp(formData.get('start_at'));
  const endAt = parseUtcTimestamp(formData.get('end_at'));
  const description = formData.get('description') ?? '';

  if (!startAt || !endAt) {
    return { success: false, message: 'Оберіть дату й час.' };
  }

  if (endAt.getTime() <= startAt.getTime()) {
    return { success: false, message: 'Час завершення має бути пізніше часу початку.' };
  }

  if (typeof description !== 'string' || description.length > 1000) {
    return { success: false, message: 'Опис має містити не більше 1000 символів.' };
  }

  return {
    success: true,
    values: {
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
      description: description.trim(),
    },
  };
}

function mutationError(error: { code?: string; message: string }): BookingActionResult {
  if (error.code === '23P01') {
    return { success: false, message: 'Цей час уже зайнятий. Оберіть інший проміжок.' };
  }
  if (error.code === '23503') {
    return { success: false, message: 'Кімната більше недоступна. Оновіть сторінку.' };
  }
  console.error(error.code, error.message);
  return { success: false, message: 'Не вдалося зберегти зміни бронювання. Спробуйте ще раз.' };
}

export async function updateBooking(
  roomId: string,
  bookingId: string,
  formData: FormData,
): Promise<BookingActionResult> {
  const { room, currentUserId } = await getRoom(roomId);
  if (room.owner_id !== currentUserId) {
    return { success: false, message: 'Змінювати бронювання може лише адміністратор кімнати.' };
  }
  const supabase = await createClient();
  const fields = readBookingFields(formData);
  if (!fields.success) return fields;

  const { data, error } = await supabase
    .from('bookings')
    .update(fields.values)
    .eq('room_id', roomId)
    .eq('id', bookingId)
    .select('id')
    .maybeSingle();

  if (error) return mutationError(error);
  if (!data) return { success: false, message: 'Бронювання не знайдено або доступ уже змінено.' };

  revalidatePath(`/rooms/${roomId}`);
  return { success: true };
}

export async function deleteBooking(
  roomId: string,
  bookingId: string,
): Promise<BookingActionResult> {
  const { room, currentUserId } = await getRoom(roomId);
  if (room.owner_id !== currentUserId) {
    return { success: false, message: 'Видаляти бронювання може лише адміністратор кімнати.' };
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bookings')
    .delete()
    .eq('room_id', roomId)
    .eq('id', bookingId)
    .select('id')
    .maybeSingle();

  if (error) return mutationError(error);
  if (!data) return { success: false, message: 'Бронювання не знайдено або доступ уже змінено.' };

  revalidatePath(`/rooms/${roomId}`);
  return { success: true };
}
