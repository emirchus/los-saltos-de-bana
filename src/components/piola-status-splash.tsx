'use client';

import { Volume2, VolumeOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useLayoutEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export function PiolaStatusSplash() {
  const [isOpen, setIsOpen] = useState(true);

  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('piola-status-splash');
      if (storedValue === 'false') {
        setIsOpen(false);
        audioPlayerRef.current?.pause();
        setIsPlaying(false);
      }
      setIsOpen(!!!storedValue);
    }
  }, []);

  const handleConfirm = () => {
    setIsOpen(false);
    audioPlayerRef.current?.play();
    setIsPlaying(true);
    localStorage.setItem('piola-status-splash', 'false');
  };

  return (
    <>
      <audio ref={audioPlayerRef} src="/temardex.mp3" loop preload="auto">
        <track kind="captions" />
        <source src="/temardex.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
      <Button
        className="absolute top-5 right-8 size-14! cursor-pointer"
        variant={'secondary'}
        size={'icon'}
        onClick={() => {
          if (audioPlayerRef.current?.paused) {
            audioPlayerRef.current?.play();
            setIsPlaying(true);
          } else {
            audioPlayerRef.current?.pause();
            setIsPlaying(false);
          }
        }}
      >
        {isPlaying ? <Volume2 className="size-10" /> : <VolumeOff className="size-10" />}
      </Button>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="splash-screen"
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100, damping: 10 }}
          >
            <div className="splash-background">
              <div className="overlay">
                <div className="w-screen h-screen flex items-center justify-start flex-col py-[5%]">
                  <div className="flex flex-1" />
                  <button
                    className="mt-[200px] confirm-button w-[400px] h-[200px] font-pricedown-bl text-4xl text-white"
                    onClick={handleConfirm}
                    type="button"
                  >
                    Confirmar Status Piola
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
