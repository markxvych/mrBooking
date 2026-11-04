# mrBooking

Meeting room booking application with shared schedules, room permissions, and meeting participants.

[Live demo](https://mr-booking-c75x.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Server Actions](https://img.shields.io/badge/Server_Actions-000000?style=flat&logo=nextdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-1C1C1C?style=flat&logo=supabase&logoColor=3ECF8E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat&logo=shadcnui&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-1A2B34?style=flat&logo=prettier&logoColor=F7B93E)

## Features

- Authentication and persistent sessions with Supabase Auth.
- Room and booking creation, editing, and deletion through Server Actions.
- Database constraints that prevent overlapping bookings.
- Room membership by email with Admin and User roles.
- Meeting participation with participant lists and author names.
- Access control through server validation and PostgreSQL RLS policies.

## Permissions

Any authenticated user can view schedules, join meetings, and create their own rooms. Room owners and assigned admins can manage bookings and add room members. Only the owner can edit or delete the room itself.

Booking authors join their meetings automatically. Cancelling a booking deletes its record.

## Local development

Requires Node.js 20.9 or newer, npm, and a configured Supabase project.

```bash
git clone https://github.com/markxvych/mrBooking.git
cd mrBooking
npm ci
cp .env.example .env.local
```

Set the following values in `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Supabase must contain the `profiles`, `rooms`, `room_members`, `bookings`, and `booking_participants` tables with the required RLS policies, functions, and triggers. Database migrations are not included in this repository.

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Scripts

| Command                | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Start the development server                |
| `npm run build`        | Create a production build                   |
| `npm start`            | Serve the production build                  |
| `npm run lint`         | Run ESLint                                  |
| `npm run typecheck`    | Generate Next.js types and check TypeScript |
| `npm run format`       | Format files with Prettier                  |
| `npm run format:check` | Check formatting                            |

## Deployment

Import the repository into Vercel using the Next.js preset. Configure both environment variables for Production and Preview before deployment. Redeploy after changing their values.

Configure Supabase Auth Site URL and Redirect URLs for the application domain when using confirmation emails. The `.env.local` file is excluded from Git.
