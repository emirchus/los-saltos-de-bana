'use client';

import { TwitchIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { resetPassword, signInWithEmail, signUpWithEmail } from '@/app/actions/auth-action';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { signInWithTwitch } from '@/app/actions';
import { Separator } from '@/components/ui/separator';

interface LoginFormProps {
  error?: string;
  success?: string;
  next?: string;
}

type View = 'login' | 'signup' | 'reset';

export function LoginForm({ error, success, next }: LoginFormProps) {
  const [view, setView] = useState<View>('login');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    if (next) {
      formData.append('next', next);
    }

    try {
      if (view === 'login') {
        await signInWithEmail(formData);
      } else if (view === 'signup') {
        await signUpWithEmail(formData);
      } else if (view === 'reset') {
        await resetPassword(formData);
      }
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {view === 'login' && 'Iniciar Sesión'}
          {view === 'signup' && 'Crear Cuenta'}
          {view === 'reset' && 'Recuperar Contraseña'}
        </CardTitle>
        <CardDescription>
          {view === 'login' && 'Ingresa a tu cuenta con email y contraseña'}
          {view === 'signup' && 'Crea una nueva cuenta'}
          {view === 'reset' && 'Te enviaremos un enlace para restablecer tu contraseña'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(error || success) && (
          <Alert variant={error ? 'destructive' : 'default'}>
            <AlertDescription>{error || success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {view !== 'reset' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="tu@email.com" required disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>
              {view === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    minLength={6}
                  />
                </div>
              )}
            </>
          )}

          {view === 'reset' && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="tu@email.com" required disabled={isLoading} />
            </div>
          )}

          {view === 'login' && (
            <div className="flex items-center justify-end">
              <Button type="button" variant="link" className="px-0 text-sm" onClick={() => setView('reset')}>
                ¿Olvidaste tu contraseña?
              </Button>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? 'Cargando...'
              : view === 'login'
                ? 'Iniciar Sesión'
                : view === 'signup'
                  ? 'Crear Cuenta'
                  : 'Enviar Enlace'}
          </Button>
        </form>

        {view !== 'reset' && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O continúa con</span>
              </div>
            </div>

            <form>
              <Button type="submit" variant="outline" className="w-full" disabled={true}>
                <Image src="/kick.svg" alt="Kick" width={22} height={26} className="size-4 select-none" />
                Continuar con Kick
              </Button>
            </form>
          </>
        )}
      </CardContent>
      {/* <CardFooter className="flex flex-col space-y-2">
        {view === 'login' && (
          <div className="text-sm text-center text-muted-foreground">
            ¿No tienes una cuenta?{' '}
            <Button type="button" variant="link" className="px-0" onClick={() => setView('signup')}>
              Regístrate
            </Button>
          </div>
        )}
        {view === 'signup' && (
          <div className="text-sm text-center text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Button type="button" variant="link" className="px-0" onClick={() => setView('login')}>
              Inicia sesión
            </Button>
          </div>
        )}
        {view === 'reset' && (
          <div className="text-sm text-center text-muted-foreground">
            <Button type="button" variant="link" className="px-0" onClick={() => setView('login')}>
              Volver al inicio de sesión
            </Button>
          </div>
        )}
      </CardFooter> */}
    </Card>
  );
}
