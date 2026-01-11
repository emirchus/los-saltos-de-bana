'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { encodedRedirect } from '@/lib/utils';

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const next = (formData.get('next') as string) || '/';

  if (!email || !password) {
    return encodedRedirect('error', '/login', 'Email y contraseña son requeridos');
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect('error', '/login', error.message);
  }

  revalidatePath('/', 'layout');
  return redirect(next);
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const next = (formData.get('next') as string) || '/';

  if (!email || !password) {
    return encodedRedirect('error', '/login', 'Email y contraseña son requeridos');
  }

  if (password !== confirmPassword) {
    return encodedRedirect('error', '/login', 'Las contraseñas no coinciden');
  }

  if (password.length < 6) {
    return encodedRedirect('error', '/login', 'La contraseña debe tener al menos 6 caracteres');
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://saltos.bana.emirchus.ar'}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    return encodedRedirect('error', '/login', error.message);
  }

  return encodedRedirect('success', '/login', 'Revisa tu email para confirmar tu cuenta');
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;

  if (!email) {
    return encodedRedirect('error', '/login', 'Email es requerido');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://saltos.bana.emirchus.ar'}/auth/reset-password`,
  });

  if (error) {
    return encodedRedirect('error', '/login', error.message);
  }

  return encodedRedirect('success', '/login', 'Revisa tu email para restablecer tu contraseña');
}
