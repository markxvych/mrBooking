'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RoomMember } from '@/lib/rooms/types';
import type { BookingActionResult } from '@/lib/bookings/types';

type RoomMembersProps = {
  members: RoomMember[];
  isAdmin: boolean;
  addMemberAction: (formData: FormData) => Promise<BookingActionResult>;
};

export function RoomMembers({ members, isAdmin, addMemberAction }: RoomMembersProps) {
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAddMember(formData: FormData) {
    setFormError('');
    setIsSubmitting(true);
    try {
      const result = await addMemberAction(formData);
      if (!result.success) setFormError(result.message ?? 'Не вдалося додати учасника.');
    } catch {
      setFormError('Не вдалося додати учасника. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-12" aria-labelledby="members-heading">
      <h2 id="members-heading" className="border-b pb-4 text-lg font-medium">
        Учасники кімнати
      </h2>
      <ul className="mt-4 space-y-2">
        {members.map((member) => (
          <li key={member.user_id} className="flex items-center gap-3 text-sm">
            <span className="break-words">{member.name}</span>
            <span className="text-muted-foreground text-xs">
              {member.role === 'admin' ? 'Admin' : 'User'}
            </span>
          </li>
        ))}
      </ul>
      {isAdmin && (
        <form
          action={handleAddMember}
          className="mt-5 flex max-w-2xl flex-wrap items-end gap-3"
          aria-busy={isSubmitting}
        >
          <div className="min-w-48 flex-1 space-y-2">
            <Label htmlFor="member-email">Email користувача</Label>
            <Input
              id="member-email"
              name="email"
              type="email"
              maxLength={320}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="member-role">Роль</Label>
            <select
              id="member-role"
              name="role"
              defaultValue="user"
              disabled={isSubmitting}
              className="bg-background h-9 rounded-md border px-3 text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Додаємо…' : 'Додати'}
          </Button>
          {formError && (
            <p role="alert" className="w-full text-sm text-red-700">
              {formError}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
