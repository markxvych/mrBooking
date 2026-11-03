import type { Metadata } from 'next';
import { HomeDashboard } from '@/components/home/home-dashboard';
import { CRUDRoom, getRooms, deleteRoom, updateRoom, logout } from './action';

export const metadata: Metadata = { title: 'Головна | mrBooking' };

export default async function HomePage() {
  const { rooms, currentUserId } = await getRooms();

  return (
    <HomeDashboard
      rooms={rooms}
      currentUserId={currentUserId}
      createRoomAction={CRUDRoom}
      deleteRoomAction={deleteRoom}
      updateRoomAction={updateRoom}
      logout={logout}
    />
  );
}
