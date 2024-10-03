'use client';

import { ClipboardCheckIcon, ClipboardIcon } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';

interface ClipboardButtonProps {
  code: string;
}

export const ClipboardButton = ({ code }: ClipboardButtonProps) => {
  const [refTimeout, setTiemoutRef] = useState<NodeJS.Timeout | undefined>();
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);

    setTiemoutRef(
      setTimeout(() => {
        setTiemoutRef(undefined);
        setIsCopied(false);
      }, 1000)
    );

    setIsCopied(true);

    return () => {
      if (refTimeout) {
        clearTimeout(refTimeout);
      }
    };
  };

  return (
    <Button onClick={copyToClipboard} className="absolute bottom-0 right-0" size={'icon'} variant={'ghost'}>
      {isCopied ? <ClipboardCheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
    </Button>
  );
};
