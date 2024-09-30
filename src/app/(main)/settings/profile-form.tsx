'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trash } from 'lucide-react';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useUser } from '@/provider/user-provider';

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'El nombre de usuario debe tener al menos 2 caracteres.',
    })
    .max(30, {
      message: 'El nombre de usuario no puede tener más de 30 caracteres.',
    }),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: 'Por favor, introduci una URL válida.' }),
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
  const { profile } = useUser();

  const supabase = createClient();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: 'onChange',
    defaultValues: {
      username: profile?.username ?? '',
      bio: profile?.bio ?? '',
      urls: (profile?.urls ?? []).map(url => ({ value: url })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'urls',
    control: form.control,
  });

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        console.log(session);
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => {
        console.log('finally');
      });
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', '494b4562-1a08-4bcb-88c7-9eb5c9ba2b4f')
        .single();

      console.log(data, error);
    })();
  }, [profile, supabase]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function onSubmit(_form: ProfileFormValues) {
    // try {
    //   const { data, error } = await supabase
    //     .from('profiles')
    //     .update({
    //       username: form.username,
    //       bio: form.bio,
    //       urls: form.urls?.map(url => url.value),
    //     })
    //     .eq('id', profile!.id)
    //     .select();
    //   console.log(data);
    //   if (error) {
    //     toast({
    //       title: 'Error',
    //       description: error.message,
    //     });
    //   }
    //   if (data) {
    //     toast({
    //       title: 'Perfil actualizado',
    //       description: 'Tu perfil ha sido actualizado.',
    //     });
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Input placeholder="papu" {...field} />
              </FormControl>
              <FormDescription>Este es tu nombre público. Puede ser tu nombre real o un seudónimo</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Hola, soy un brocoli" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>
                La bio es una descripción breve de tu perfil. Ojito con lo que escribís acá.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>URLs</FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    Agrega links a tu sitio web, blog, o redes sociales.
                  </FormDescription>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ value: '' })}>
            Añadir URL
          </Button>
        </div>
        <Button type="submit">Actualizar perfil</Button>
      </form>
    </Form>
  );
}
