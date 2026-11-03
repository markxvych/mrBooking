'use server';

import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import type { RoomMember } from '@/lib/rooms/types';

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
    .select('id, name, description, owner_id, owner:profiles!rooms_owner_profile_fkey(name)')
    .returns<
      {
        id: string;
        name: string;
        description: string;
        owner_id: string;
        owner: { name: string } | null;
      }[]
    >();

  if (roomsError) {
    console.error(roomsError.code, roomsError.message);
    throw new Error('Не вдалося завантажити кімнати.');
  }

  return {
    rooms: (rooms ?? []).map(({ owner, ...room }) => ({
      ...room,
      owner_name: owner?.name ?? 'Користувач',
    })),
    currentUserId: user.id,
  };
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
  revalidatePath(`/rooms/${roomId}`);
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

  const { data: updatedRooms, error: updateError } = await supabase
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
  revalidatePath(`/rooms/${roomId}`);
  return { success: true };
}

// get one room
export async function getRoom(roomId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(roomId)) {
    notFound();
  }

  const { data: room, error } = await supabase
    .from('rooms')
    .select('id, name, description, owner_id, owner:profiles!rooms_owner_profile_fkey(name)')
    .eq('id', roomId)
    .returns<
      {
        id: string;
        name: string;
        description: string;
        owner_id: string;
        owner: { name: string } | null;
      }[]
    >()
    .maybeSingle();

  if (error) {
    console.error(error.code, error.message);
    throw new Error('Не вдалося завантажити кімнату.');
  }

  if (!room) {
    notFound();
  }

  const { data: members, error: membersError } = await supabase
    .from('room_members')
    .select('user_id, role, profile:profiles(name)')
    .eq('room_id', roomId)
    .returns<{ user_id: string; role: RoomMember['role']; profile: { name: string } | null }[]>();

  if (membersError) throw new Error('Не вдалося завантажити учасників кімнати.');

  const roomMembers: RoomMember[] = [
    { user_id: room.owner_id, name: room.owner?.name ?? 'Користувач', role: 'admin' },
    ...(members ?? []).map((member) => ({
      user_id: member.user_id,
      name: member.profile?.name ?? 'Користувач',
      role: member.role,
    })),
  ];
  const isAdmin = roomMembers.some(
    (member) => member.user_id === user.id && member.role === 'admin',
  );

  return { room, currentUserId: user.id, isAdmin, members: roomMembers };
}

// logout
export async function logout() {
  const supabase = await createClient();

  const { error: logoutError } = await supabase.auth.signOut({ scope: 'local' });

  if (logoutError) {
    console.error(logoutError.code, logoutError.message);
    return;
  }
  revalidatePath('/', 'layout');
  redirect('/');
}
