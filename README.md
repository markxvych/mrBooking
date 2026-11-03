# mrBooking

Основа вебдодатку для бронювання переговорних кімнат.

## Стек

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase, ESLint і Prettier.
Код розташований у `src/`; аліас `@/*` посилається на `src/*`.

## Запуск

```bash
npm install
npm run dev
```

Відкрий http://localhost:3000.

## Supabase

У `.env.local` заповни значення з налаштувань свого Supabase-проєкту:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Шаблон змінних збережений у `.env.example`. `.env.local` не потрапляє в Git.
Без ключів стартова сторінка працює, але підключення Supabase не активоване.
Віддалений Supabase-проєкт і таблиці ще не створені.

- `src/lib/supabase/client.ts` — клієнт для Client Components.
- `src/lib/supabase/server.ts` — клієнт для Server Components, Server Actions і Route Handlers.
- `src/proxy.ts` і `src/lib/supabase/proxy.ts` — оновлення сесії через cookies.

Налаштування відповідає [офіційній документації Supabase SSR](https://supabase.com/docs/guides/auth/server-side/nextjs).
Форми входу, перевірки доступу до маршрутів і політики RLS додаються разом із відповідною функціональністю.

## Команди

```bash
npm run dev           # розробка
npm run build         # production-збірка
npm run start         # запуск production-збірки
npm run lint          # ESLint
npm run typecheck     # TypeScript
npm run format        # форматування
npm run format:check  # перевірка форматування
```

## shadcn/ui

Компоненти зберігаються в `src/components/ui`.

Додати компонент:

```bash
npx shadcn@latest add calendar
```

## Домовленості щодо ролей

Ролі діють у межах конкретної кімнати. Творець кімнати автоматично стає її Admin.
Admin керує кімнатою та бронюваннями, додає користувачів за email з роллю Admin або User.
User переглядає бронювання й долучається до зустрічей.

Це початкове налаштування проєкту. Реєстрація, кімнати та бронювання ще не реалізовані.
