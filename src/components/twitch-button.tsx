'use client';

import { TwitchIcon } from 'lucide-react';

import { signInWithTwitch } from '@/app/actions';
import { Button } from '@/components/ui/button';

export default function TwitchButton() {
  return (
    <Button
      className="transform rounded-lg bg-[#9146FF] px-4 py-2 font-semibold text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:bg-[#7C3AED] focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      onClick={() => signInWithTwitch()}
    >
      <TwitchIcon className="mr-2 h-5 w-5" />
      Usar Twitch
    </Button>
  );
}
