<div align="center">

<h1>📅 mrBooking</h1>

<p>Бронювання переговорних кімнат · Meeting room booking</p>

<p>
  <a href="https://mr-booking-c75x.vercel.app/">🚀 Live Demo / Демо</a>
  &nbsp;·&nbsp;
  <a href="#uk">🇺🇦 Українська</a>
  &nbsp;·&nbsp;
  <a href="#en">🇬🇧 English</a>
</p>

<p>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&amp;logo=nextdotjs&amp;logoColor=white" alt="Next.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&amp;logo=react&amp;logoColor=61DAFB" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&amp;logo=typescript&amp;logoColor=white" alt="TypeScript" /></a>
  <a href="https://nextjs.org/docs/app/guides/forms"><img src="https://img.shields.io/badge/Server_Actions-000000?style=for-the-badge&amp;logo=nextdotjs&amp;logoColor=white" alt="Next.js Server Actions" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-1C1C1C?style=for-the-badge&amp;logo=supabase&amp;logoColor=3ECF8E" alt="Supabase" /></a>
  <br />
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&amp;logo=tailwindcss&amp;logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://ui.shadcn.com/"><img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&amp;logo=shadcnui&amp;logoColor=white" alt="shadcn/ui" /></a>
  <a href="https://eslint.org/"><img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&amp;logo=eslint&amp;logoColor=white" alt="ESLint" /></a>
  <a href="https://prettier.io/"><img src="https://img.shields.io/badge/Prettier-1A2B34?style=for-the-badge&amp;logo=prettier&amp;logoColor=F7B93E" alt="Prettier" /></a>
</p>

</div>

---

<a id="uk"></a>

## 🇺🇦 Українська

**mrBooking** — вебзастосунок для бронювання переговорних кімнат, керування розкладом та участі в зустрічах. Побудований на Next.js App Router із серверними екшенами та Supabase.

**Демо на Vercel:** [mr-booking-c75x.vercel.app](https://mr-booking-c75x.vercel.app/)

### ✨ Можливості

- Реєстрація за ім’ям, email і паролем, вхід та вихід з акаунта.
- Збереження сесії через Supabase Auth і cookies.
- Створення, редагування та видалення власних кімнат.
- Бронювання з датою, часом початку й завершення та описом.
- Перевірка перетинів часу на рівні бази даних; скасування бронювання видаляє запис.
- Додавання зареєстрованих користувачів до кімнати за email з роллю **Admin** або **User**.
- Долучення до зустрічей, вихід із них та відображення списків учасників.
- Імена авторів кімнат і бронювань та перевірка доступу через серверні екшени й RLS.

### 👥 Ролі

Роль діє в конкретній кімнаті. Кожен зареєстрований користувач може створити власну кімнату й автоматично стати її адміністратором.

| Дія                                             | Власник кімнати | Доданий Admin | User / інший користувач |
| ----------------------------------------------- | :-------------: | :-----------: | :---------------------: |
| Переглядати кімнати й розклад                   |       ✅        |      ✅       |           ✅            |
| Долучатися до зустрічей і виходити з них        |       ✅        |      ✅       |           ✅            |
| Створювати, редагувати й скасовувати бронювання |       ✅        |      ✅       |            —            |
| Додавати учасників кімнати та призначати ролі   |       ✅        |      ✅       |            —            |
| Редагувати й видаляти саму кімнату              |       ✅        |       —       |            —            |

Автор бронювання автоматично додається до зустрічі. Додавання людини до кімнати не записує її на всі зустрічі.

### 🛠️ Локальний запуск

**Потрібно:** Node.js **20.9+**, npm і налаштований проєкт Supabase.

```bash
git clone https://github.com/markxvych/mrBooking.git
cd mrBooking
npm ci
cp .env.example .env.local
```

Заповніть `.env.local` значеннями свого проєкту Supabase:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

База має містити таблиці `profiles`, `rooms`, `room_members`, `bookings`, `booking_participants` та відповідні RLS-політики, функції й тригери. Застосунок підключається до вже налаштованої бази; SQL-міграції поки не включені до репозиторію.

```bash
npm run dev
```

Відкрийте [localhost:3000](http://localhost:3000).

### 📦 Команди

| Команда                | Призначення                                    |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Запуск сервера розробки                        |
| `npm run build`        | Продакшн-збірка                                |
| `npm start`            | Запуск продакшн-збірки після `npm run build`   |
| `npm run lint`         | Перевірка ESLint                               |
| `npm run typecheck`    | Генерація типів Next.js і перевірка TypeScript |
| `npm run format`       | Форматування Prettier                          |
| `npm run format:check` | Перевірка форматування                         |

### 🚀 Vercel

Імпортуйте репозиторій у Vercel як проєкт **Next.js**, додайте обидві змінні з `.env.local` до **Environment Variables** для потрібних середовищ і натисніть **Deploy**. Після зміни змінних запустіть новий деплой.

Для листів підтвердження Supabase Auth налаштуйте **Site URL** та **Redirect URLs** під потрібну адресу застосунку. Файл `.env.local` виключений із Git.

---

<a id="en"></a>

## 🇬🇧 English

**mrBooking** is a web app for booking meeting rooms, managing schedules, and joining meetings. Built with the Next.js App Router, Server Actions, and Supabase.

**Live demo on Vercel:** [mr-booking-c75x.vercel.app](https://mr-booking-c75x.vercel.app/)

### ✨ Features

- Registration with a name, email, and password; sign-in and sign-out.
- Persistent sessions using Supabase Auth and cookies.
- Create, edit, and delete your own meeting rooms.
- Bookings with a date, start and end times, and a description.
- Database-level prevention of overlapping bookings; cancelling a booking deletes its record.
- Add registered users to a room by email with an **Admin** or **User** role.
- Join and leave meetings and view participant lists.
- Room and booking author names, with access checks in Server Actions and RLS policies.

### 👥 Roles

Roles apply to individual rooms. Any registered user can create a room and automatically become its owner and administrator.

| Action                            | Room owner | Added Admin | User / other user |
| --------------------------------- | :--------: | :---------: | :---------------: |
| View rooms and schedules          |     ✅     |     ✅      |        ✅         |
| Join and leave meetings           |     ✅     |     ✅      |        ✅         |
| Create, edit, and cancel bookings |     ✅     |     ✅      |         —         |
| Add room members and assign roles |     ✅     |     ✅      |         —         |
| Edit and delete the room itself   |     ✅     |      —      |         —         |

Booking authors automatically join their meetings. Adding someone to a room does not automatically add them to its meetings.

### 🛠️ Run locally

**Requirements:** Node.js **20.9+**, npm, and a configured Supabase project.

```bash
git clone https://github.com/markxvych/mrBooking.git
cd mrBooking
npm ci
cp .env.example .env.local
```

Fill in `.env.local` with your Supabase project values:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The database must contain `profiles`, `rooms`, `room_members`, `bookings`, and `booking_participants`, together with the required RLS policies, functions, and triggers. The app connects to an existing configured database; SQL migrations are not yet included in this repository.

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000).

### 📦 Commands

| Command                | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Start the development server                     |
| `npm run build`        | Create a production build                        |
| `npm start`            | Serve the production build after `npm run build` |
| `npm run lint`         | Run ESLint                                       |
| `npm run typecheck`    | Generate Next.js types and run TypeScript checks |
| `npm run format`       | Format files with Prettier                       |
| `npm run format:check` | Check formatting                                 |

### 🚀 Vercel

Import the repository into Vercel as a **Next.js** project, add both variables from `.env.local` under **Environment Variables** for the environments you need, and select **Deploy**. Redeploy after changing environment variables.

For Supabase Auth confirmation emails, configure **Site URL** and **Redirect URLs** for your application URL. The `.env.local` file is excluded from Git.
