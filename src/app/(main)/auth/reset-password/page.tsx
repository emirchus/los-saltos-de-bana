import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ResetPasswordForm } from './components/reset-password-form';

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; success?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si no hay usuario, redirigir al login
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Restablecer Contraseña</h1>
          <p className="text-sm text-muted-foreground">
            Ingresa tu nueva contraseña
          </p>
        </div>
        <ResetPasswordForm error={searchParams.error} success={searchParams.success} />
      </div>
    </div>
  );
}
