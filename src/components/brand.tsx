import Link from 'next/link';
import { DoorOpen } from 'lucide-react';

export function Brand({ href = '/' }: { href?: string }) {
  return (
    <Link
      href={href}
      aria-label="mrBooking — головна"
      className="inline-flex items-center gap-2.5 rounded-sm font-semibold tracking-tight outline-offset-4"
    >
      <span className="bg-foreground text-background flex size-8 items-center justify-center rounded-lg">
        <DoorOpen className="size-4" aria-hidden="true" />
      </span>
      <span className="text-lg">
        mrBooking<span className="text-emerald-700">.</span>
      </span>
    </Link>
  );
}
