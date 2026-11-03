import type { Metadata } from 'next';
import { register } from '../actions';

import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = { title: 'Реєстрація | mrBooking' };

export default function RegisterPage() {
  return <AuthForm mode="register" action={register} />;
}
