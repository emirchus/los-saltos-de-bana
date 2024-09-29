'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/provider/user-provider';

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'El nombre debe tener al menos 2 caracteres.',
    })
    .max(30, {
      message: 'El nombre no puede tener más de 30 caracteres.',
    }),
  email: z
    .string({
      required_error: 'Dale, poné tu email.',
    })
    .email({
      message: 'Che, usá una dirección de correo electrónico válida.',
    }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const { user } = useUser();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: user?.user_metadata.full_name,
      email: user?.email,
    },
  });

  function onSubmit(data: AccountFormValues) {
    toast({
      title: 'Mandaste estos valores:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Papu lince" {...field} />
              </FormControl>
              <FormDescription>Este es el nombre que se va a mostrar en tu perfil y en los mails.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder="papu@gmail.com" {...field} />
              </FormControl>
              <FormDescription>Tu correo electrónico se usa para la autenticación.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Actualizar cuenta</Button>
      </form>
    </Form>
  );
}
