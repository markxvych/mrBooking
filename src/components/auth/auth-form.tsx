'use client';

import { useState, useTransition, type FormEvent, JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type AuthFormProps = {
  mode: 'login' | 'register';
  action: (formData: FormData) => Promise<void>;
};

export function AuthForm({mode,action}: AuthFormProps) {
  const registering = mode === 'register';
  const [showPassword, setShowPassword] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <section className="w-full max-w-sm" aria-labelledby="auth-title">
      <h1 id="auth-title" className="text-3xl font-semibold tracking-tight">
        {registering ? 'Створіть обліковий запис' : 'З поверненням'}
      </h1>
      <p className="text-muted-foreground mt-3 text-sm leading-6">
        {registering
          ? 'Почніть планувати зустрічі разом із командою.'
          : 'Увійдіть, щоб перейти до ваших кімнат.'}
      </p>
      <form
        action={action}
        method="post"
        className="mt-8 space-y-5"
        aria-describedby="auth-preview"
        aria-busy={pending}
      >
        <fieldset disabled={pending} className="space-y-5">
          {registering && (
            <div className="space-y-2">
              <Label htmlFor="name">Ім’я</Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                placeholder="Ваше ім’я"
                required
                pattern=".*\S.*"
                maxLength={100}
                className="bg-background h-11 px-3"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Електронна пошта</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
              maxLength={254}
              className="bg-background h-11 px-3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={registering ? 'new-password' : 'current-password'}
                placeholder={registering ? 'Щонайменше 8 символів' : 'Введіть пароль'}
                minLength={registering ? 8 : undefined}
                required
                className="bg-background h-11 pr-12 pl-3"
                aria-describedby={registering ? 'password-hint' : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1.5 right-1.5"
                aria-label={showPassword ? 'Приховати пароль' : 'Показати пароль'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              </Button>
            </div>
            {registering && (
              <p id="password-hint" className="text-muted-foreground text-xs">
                Використайте щонайменше 8 символів.
              </p>
            )}
          </div>
          <Button type="submit" className="h-11 w-full" disabled={pending}>
            {pending ? (
              <>
                <LoaderCircle className="animate-spin" aria-hidden="true" />
                Переходимо…
              </>
            ) : (
              <>
                {registering ? 'Зареєструватися' : 'Увійти'}
                <ArrowRight aria-hidden="true" />
              </>
            )}
          </Button>
        </fieldset>
      </form>
      <p className="text-muted-foreground mt-6 text-center text-sm">
        {registering ? 'Уже маєте обліковий запис? ' : 'Ще немає облікового запису? '}
        <Link
          href={registering ? '/login' : '/register'}
          className="text-foreground rounded-sm font-medium underline-offset-4 outline-offset-4 hover:underline"
        >
          {registering ? 'Увійти' : 'Зареєструватися'}
        </Link>
      </p>
    </section>
  );
}
