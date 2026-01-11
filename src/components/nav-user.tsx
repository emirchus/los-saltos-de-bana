import type { User } from '@supabase/supabase-js';
import { BadgeCheck, ChevronsUpDown, LogOut, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { signOutAction } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/lib/supabase/client';

export function NavUser({ user }: { user?: User | null }) {
  const { setTheme, resolvedTheme } = useTheme();

  if (!user) {
    return;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-full rounded-md outline-hidden ring-ring hover:bg-accent focus-visible:ring-2 data-[state=open]:bg-accent">
        <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm transition-all">
          <Avatar className="h-7 w-7 rounded-md border">
            <AvatarFallback className="rounded-md">{'🤖'}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 leading-none">
            <div className="font-medium">{user?.user_metadata.full_name}</div>
            <div className="overflow-hidden text-xs text-muted-foreground">
              <div className="line-clamp-1">{user?.email}</div>
            </div>
          </div>
          <ChevronsUpDown className="ml-auto mr-0.5 h-4 w-4 text-muted-foreground/50" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={4}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm transition-all">
            <Avatar className="h-7 w-7 rounded-md">
              <AvatarFallback>{'🤖'}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1">
              <div className="font-medium">{user?.user_metadata.full_name}</div>
              <div className="overflow-hidden text-xs text-muted-foreground">
                <div className="line-clamp-1">{user?.email}</div>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="gap-2" asChild>
            <Link href="/settings">
              <BadgeCheck className="h-4 w-4 text-muted-foreground" />
              Cuenta
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            Tema {resolvedTheme === 'dark' ? 'Claro' : 'Oscuro'}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2"
          onClick={async () => {
            await supabase.auth.signOut();
            await signOutAction();
          }}
        >
          <LogOut className="h-4 w-4 text-muted-foreground" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
