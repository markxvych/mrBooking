import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function RoomNotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Кімнату не знайдено</h1>
      <p className="text-muted-foreground max-w-sm text-sm leading-6">
        Кімнату видалено або посилання містить неправильний ID.
      </p>
      <Button asChild className="mt-2 h-10 px-4">
        <Link href="/home">До списку кімнат</Link>
      </Button>
    </main>
  );
}
