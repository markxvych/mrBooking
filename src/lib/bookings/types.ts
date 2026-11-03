export type Booking = {
  id: string;
  start_at: string;
  end_at: string;
  description: string | null;
  author_name: string;
};

export type BookingActionResult = { success: boolean; message?: string };
