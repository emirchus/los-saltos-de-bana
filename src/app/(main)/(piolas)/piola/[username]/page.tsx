import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getUserProfile } from '@/app/(main)/(piolas)/actions/profile-action';
import { ProfileView } from '@/app/(main)/(piolas)/components/profile-view';
import { StarsView } from '@/app/(main)/(piolas)/components/stars-view';
import { VideoBackground } from '@/app/(main)/(piolas)/components/video-background';
import { SiteHeader } from '@/components/site-header';

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export const generateMetadata = async ({ params }: Props) => {
  const { username } = await params;
  const profile = await getUserProfile(username);

  if (!profile) {
    return {
      title: 'Perfil no encontrado',
      description: 'Perfil no encontrado en Los Piola de Bana',
    };
  }

  return {
    title: `Perfil de ${username}`,
  };
};

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const profile = await getUserProfile(username);
  if (!profile) {
    notFound();
  }

  return (
    <div className="w-full h-full relative overflow-auto overflow-x-hidden">
      <VideoBackground
        videoUrl={'https://kuynskxmgfjuveklharx.supabase.co/storage/v1/object/public/videos/Video%20Project%201.mp4'}
      />
      <StarsView />
      <SiteHeader title="" />
      <Suspense
        fallback={<div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">Cargando perfil...</div>}
      >
        <ProfileView profile={profile} username={username} />
      </Suspense>
    </div>
  );
}
