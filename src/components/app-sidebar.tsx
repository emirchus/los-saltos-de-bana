'use client';

import { ArrowRight, Compass, Dices, Map, PlusSquareIcon, Send, Twitter } from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import { JumpNotFound } from '@/components/storage-card';
import { Logo } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from '@/components/ui/sidebar';
import { useUser } from '@/provider/user-provider';

const data = {
  navMain: [
    {
      title: 'Mapa',
      url: '/',
      icon: Map,
    },
    {
      title: 'Bingo',
      url: '/bingo',
      icon: Dices,
      items: [
        {
          title: 'Crear sala',
          url: '/bingo/create',
          icon: PlusSquareIcon,
          description: 'Crea una sala de bingo para jugar con tus amigos.',
        },
        {
          title: 'Explorar salas',
          url: '/bingo/explore',
          icon: Compass,
          description: 'Explora salas de bingo disponibles para jugar.',
        },
        {
          title: 'Unirse a sala',
          url: '/bingo/join',
          icon: ArrowRight,
          description: 'Unite a una sala de bingo existente.',
        },
      ],
    },
  ],

  navSecondary: [
    {
      title: 'Twitter',
      url: 'https://x.com/emirchus',
      icon: Twitter,
    },
    {
      title: 'Colaborar',
      url: 'https://github.com/emirchus/los-saltos-de-bana',
      icon: Send,
    },
  ],
};

export function AppSidebar() {
  const { user, profile } = useUser();

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem>
          <SidebarLabel>Saltos</SidebarLabel>
          <NavProjects projects={[]} isSub={profile?.sub ?? false} />
        </SidebarItem>
        <SidebarItem>
          <SidebarLabel>Páginas</SidebarLabel>
          <NavMain items={data.navMain} />
        </SidebarItem>
        <SidebarItem className="mt-auto">
          <SidebarLabel>Equipo</SidebarLabel>
          <NavSecondary items={data.navSecondary} />
        </SidebarItem>
        <SidebarItem>
          <JumpNotFound />
        </SidebarItem>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
