'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// CRUD
export async function CRUDRoom(
  formData: FormData,
): Promise<{ success: boolean; message?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, message: 'Увійдіть повторно, щоб створити кімнату.' };
  }

  const name = formData.get('name');
  const description = formData.get('description') ?? '';

  if (typeof name !== 'string' || !name.trim() || name.trim().length > 100) {
    return { success: false, message: 'Вкажіть назву кімнати від 1 до 100 символів.' };
  }

  if (typeof description !== 'string' || description.length > 1000) {
    return { success: false, message: 'Опис кімнати має містити не більше 1000 символів.' };
  }

  const { error } = await supabase
    .from('rooms')
    .insert({ name: name.trim(), description: description.trim() });

  if (error) {
    console.error(error.code, error.message);
    return { success: false, message: 'Не вдалося створити кімнату. Спробуйте ще раз.' };
  }

  revalidatePath('/home');
  return { success: true };
}

// get rooms
export async function getRooms() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error(error?.code, error?.message);
    redirect('/login');
  }

  const { data: rooms, error: roomsError } = await supabase
    .from('rooms')
    .select('id, name, description, owner_id');

  if (roomsError) {
    console.error(roomsError.code, roomsError.message);
    throw new Error('Не вдалося завантажити кімнати.');
  }

  return { rooms: rooms ?? [], currentUserId: user.id };
}

// delete room
export async function deleteRoom(roomId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    console.error(error?.code, error?.message);
    redirect('/login');
  }

  const { data: rooms, error: deleteErrors } = await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId)
    .eq('owner_id', user.id)
    .select('id');

  if (deleteErrors || !rooms?.length) {
    console.error(deleteErrors?.message ?? 'Кімнату не видалено.');
    return;
  }

  revalidatePath('/home');
}

// update room
export async function updateRoom(roomId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error(authError?.code, authError?.message);
    redirect('/login');
  }

  const name = formData.get('name');
  const description = formData.get('description') ?? '';


  if (typeof name !== 'string' || !name.trim() || name.trim().length > 100) {
    return { success: false, message: 'Вкажіть назву кімнати від 1 до 100 символів.' };
  }
  if (typeof description !== 'string' || description.length > 1000) {
    return { success: false, message: 'Опис кімнати має містити не більше 1000 символів.' };
  }

  const { data: updatedRooms, error : updateError } = await supabase
    .from('rooms')
    .update({
      name: name.trim(),
      description: description.trim(),
    })
    .eq('id', roomId)
    .eq('owner_id', user.id)
    .select('id');

  if (updateError || !updatedRooms?.length) {
    return { success: false, message: 'Не вдалося змінити кімнату.' };
  }

  revalidatePath('/home');
  return { success: true };

}
