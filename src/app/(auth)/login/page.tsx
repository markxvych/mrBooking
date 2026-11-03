import type { Metadata } from 'next';

import { AuthForm } from '@/components/auth/auth-form';
import {login} from "../actions"
export const metadata: Metadata = { title: 'Увійти | mrBooking' };

export default function LoginPage() {
  return <AuthForm mode="login" action={login} />;
}
