import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <main className="bg-muted/30 flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">mrBooking</CardTitle>
          <CardDescription>Бронювання переговорних кімнат.</CardDescription>
        </CardHeader>
      </Card>
    </main>
  );
}
