import { ImageResponse } from 'next/og';
import { getUserProfile } from '@/app/(main)/(piolas)/actions/profile-action';

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image({ params }: { params: { slug: string } }) {
  const profile = await getUserProfile(params.slug);
  if (!profile) {
    return new ImageResponse(
      <div>
        <h1>Perfil no encontrado</h1>
      </div>
    );
  }

  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#fff',
        fontSize: 32,
        fontWeight: 600,
        backgroundImage: 'url(https://kuynskxmgfjuveklharx.supabase.co/storage/v1/object/public/videos/og.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 style={{ color: 'white', marginLeft: '50px' }}>{`${profile.userStats[0].username}`}</h1>
    </div>
  );
}
