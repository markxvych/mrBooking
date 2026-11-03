'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, DoorOpen, Plus } from 'lucide-react';

import { Brand } from '@/components/brand';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Room = { id: string; name: string; description: string; owner_id: string; owner_name: string };

type HomeDashboardProps = {
  rooms: Room[];
  currentUserId: string;
  createRoomAction: (formData: FormData) => Promise<{ success: boolean; message?: string }>;
  deleteRoomAction: (id: string) => Promise<void>;
  updateRoomAction: (
    roomId: string,
    formData: FormData,
  ) => Promise<{ success: boolean; message?: string }>;
};

export function HomeDashboard({
  rooms,
  currentUserId,
  createRoomAction,
  deleteRoomAction,
  updateRoomAction,
}: HomeDashboardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createButton = useRef<HTMLButtonElement>(null);

  async function handleSaveRoom(formData: FormData) {
    setFormError('');
    setIsSubmitting(true);

    try {
      const result = editingRoom
        ? await updateRoomAction(editingRoom.id, formData)
        : await createRoomAction(formData);

      if (!result.success) {
        setFormError(result.message ?? 'Не вдалося створити кімнату.');
        return;
      }

      setDialogOpen(false);
    } catch {
      setFormError('Не вдалося створити кімнату. Перевірте з’єднання та спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-svh">
      <header className="bg-background border-b">
        <div className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-8">
            <Brand href="/home" />
            <nav aria-label="Основна навігація">
              <a
                href="#rooms"
                className="rounded-sm text-sm font-medium underline decoration-emerald-700 decoration-2 underline-offset-8 outline-offset-4"
              >
                Кімнати
              </a>
            </nav>
          </div>
          <Button asChild variant="ghost" className="px-0 sm:px-3">
            <Link href="/">
              <ArrowLeft aria-hidden="true" />
              <span className="hidden sm:inline">На стартову</span>
              <span className="sm:hidden">Назад</span>
            </Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <p className="text-sm font-medium text-emerald-700">Ваш робочий простір</p>
        <div className="mt-3 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Зустрічі починаються тут.
            </h1>
            <p className="text-muted-foreground mt-4 max-w-lg text-sm leading-6">
              Переглядайте переговорні та створюйте власні кімнати для зустрічей.
            </p>
          </div>
          <Button
            ref={createButton}
            className="h-11 px-5"
            onClick={() => {
              setEditingRoom(null);
              setDialogOpen(true);
            }}
          >
            <Plus aria-hidden="true" />
            Створити кімнату
          </Button>
        </div>

        <section id="rooms" className="mt-12 scroll-mt-8" aria-labelledby="rooms-heading">
          <div className="flex items-center justify-between gap-4 border-b pb-4">
            <h2 id="rooms-heading" className="text-lg font-medium">
              Усі кімнати{' '}
              <span className="text-muted-foreground ml-2 text-sm font-normal">{rooms.length}</span>
            </h2>
          </div>
          {rooms.length === 0 ? (
            <div className="bg-background mt-6 flex flex-col items-center rounded-xl border border-dashed px-6 py-16 text-center sm:py-20">
              <span className="bg-muted mb-5 flex size-12 items-center justify-center rounded-xl">
                <DoorOpen className="text-muted-foreground size-6" aria-hidden="true" />
              </span>
              <h3 className="text-base font-medium">Кімнат поки немає</h3>
              <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-6">
                Створіть першу переговорну. Ви автоматично станете її адміністратором.
              </p>
              <Button
                variant="outline"
                className="mt-6 h-10 px-4"
                onClick={() => {
                  setEditingRoom(null);
                  setDialogOpen(true);
                }}
              >
                <Plus aria-hidden="true" />
                Створити першу кімнату
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <article key={room.id} className="bg-background rounded-xl border p-6">
                  <div className="flex items-center justify-between gap-4">
                    <DoorOpen className="text-muted-foreground size-5" aria-hidden="true" />
                    {room.owner_id === currentUserId && (
                      <form action={deleteRoomAction.bind(null, room.id)}>
                        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800">
                          Admin
                        </span>
                        <Button variant="outline" type="submit">
                          Delete
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingRoom(room);
                            setDialogOpen(true);
                          }}
                        >
                          Update
                        </Button>
                      </form>
                    )}
                  </div>
                  <h3 className="mt-5 text-lg font-medium break-words">{room.name}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-6 break-words whitespace-pre-wrap">
                    {room.description || 'Опис кімнати ще не додано.'}
                  </p>
                  <p className="text-muted-foreground mt-3 text-xs break-words">
                    Власник: {room.owner_name}
                  </p>
                  <Button asChild variant="outline" className="mt-5 h-10 w-full">
                    <Link href={`/rooms/${room.id}`} aria-label={`Відкрити кімнату «${room.name}»`}>
                      Відкрити
                    </Link>
                  </Button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (isSubmitting) return;
          setFormError('');
          setDialogOpen(open);
        }}
      >
        <DialogContent
          className="p-6 sm:max-w-md"
          showCloseButton={false}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            createButton.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editingRoom ? 'Редагувати кімнату' : 'Нова кімната'}
            </DialogTitle>
            <DialogDescription>
              Додайте назву й опис переговорної. Ви станете її адміністратором.
            </DialogDescription>
          </DialogHeader>
          <form
            action={handleSaveRoom}
            className="mt-2 space-y-5"
            aria-busy={isSubmitting}
            key={editingRoom?.id ?? 'create'}
          >
            <div className="space-y-2">
              <Label htmlFor="room-name">Назва кімнати</Label>
              <Input
                defaultValue={editingRoom?.name ?? ''}
                id="room-name"
                name="name"
                placeholder="Наприклад, Велика переговорна"
                className="h-11 px-3"
                required
                disabled={isSubmitting}
                maxLength={100}
                pattern=".*\S.*"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="room-description">
                Опис <span className="text-muted-foreground font-normal">(необов’язково)</span>
              </Label>
              <textarea
                defaultValue={editingRoom?.description ?? ''}
                id="room-description"
                name="description"
                placeholder="Для яких зустрічей підходить кімната?"
                maxLength={1000}
                rows={3}
                disabled={isSubmitting}
                className="bg-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full resize-y rounded-lg border px-3 py-2.5 text-sm outline-none focus-visible:ring-3"
              />
            </div>
            {formError && (
              <p role="alert" className="text-sm text-red-700">
                {formError}
              </p>
            )}
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                className="h-10 px-4"
                disabled={isSubmitting}
                onClick={() => setDialogOpen(false)}
              >
                Скасувати
              </Button>
              <Button type="submit" className="h-10 px-4" disabled={isSubmitting}>
                {isSubmitting ? 'Збереження…' : editingRoom ? 'Змінити' : 'Створити кімнату'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
