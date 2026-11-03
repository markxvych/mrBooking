import Link from 'next/link';
import { ArrowRight, CalendarDays, DoorOpen, Users } from 'lucide-react';

import { Brand } from '@/components/brand';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="bg-background border-b">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          <Brand />
          <Button asChild variant="ghost" className="h-10 px-4">
            <Link href="/login">
              Увійти <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-medium text-emerald-700">
            Менше організації. Більше розмов.
          </p>
          <h1 className="text-4xl leading-[1.12] font-semibold tracking-tight sm:text-6xl">
            Вітаємо у mrBooking<span className="text-emerald-700">.</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-8">
            Знаходьте вільну переговорну, плануйте зустрічі та запрошуйте колег. Усе для вашої
            команди — в одному місці.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11 px-6">
              <Link href="/register">
                Зареєструватися <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-6">
              <Link href="/login">Увійти</Link>
            </Button>
          </div>
        </div>
        <div className="mt-20 grid gap-8 border-t pt-8 sm:grid-cols-3 sm:gap-10">
          {[
            {
              icon: DoorOpen,
              title: 'Ваші кімнати',
              text: 'Створюйте простори для командних зустрічей.',
            },
            {
              icon: CalendarDays,
              title: 'Зручні бронювання',
              text: 'Обирайте час без накладок у розкладі.',
            },
            {
              icon: Users,
              title: 'Уся команда поруч',
              text: 'Запрошуйте колег і керуйте доступом.',
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <Icon className="text-muted-foreground mb-4 size-5" aria-hidden="true" />
              <h2 className="font-medium">{title}</h2>
              <p className="text-muted-foreground mt-2 max-w-xs text-sm leading-6">{text}</p>
            </div>
          ))}
        </div>
      </main>
      <footer className="text-muted-foreground mx-auto w-full max-w-6xl px-5 pb-7 text-xs sm:px-8">
        mrBooking · Простір для продуктивних зустрічей
      </footer>
    </div>
  );
}
