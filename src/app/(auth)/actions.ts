'use server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

//functions
export async function register(formData:FormData){
  const supabase = await createClient()

  const username = formData.get('name');
  const email = formData.get('email');
  const password = formData.get('password');

  const {error} = await supabase.auth.signUp(
    {
      email,
      password,
       options:{
         data:{
           name:username
         },
       },
    }
  );

  if (error) {
    console.error(error.code, error.message);
    return;
  }
   redirect('/login')
}

export async function login(formData:FormData){
  const supabase = await createClient()

  const email = formData.get('email');
  const password = formData.get('password');

  const {error} = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) {
    console.error(error.code, error.message);
    return;
  }
   redirect('/home');
}