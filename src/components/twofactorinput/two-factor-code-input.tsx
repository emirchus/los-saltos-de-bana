'use client';

import { ClipboardEvent, KeyboardEvent, useState } from 'react';

import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

interface Props {
  onChange: (code: string) => void;
  className?: string;
}

export const TwoFactorCodeInput = ({ onChange, className }: Props) => {
  const [codes, setCodes] = useState(new Array(6).fill(''));
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>();

  const nextInput = (index: number) => {
    if (index + 1 < codes.length) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  };
  const prevInput = (index: number) => {
    if (index - 1 >= 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };
  const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onChange(codes.join(''));
      if (codes.join('').length != 6) setErrorMessage('El código debe tener 6 dígitos');
      return;
    }
    setErrorMessage(null);
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newCodes = [...codes.slice(0, index), '', ...codes.slice(index + 1)];
      setCodes(newCodes);
      prevInput(index);
      return;
    }
    if (e.key === 'ArrowLeft' && index - 1 >= 0) {
      prevInput(index);
      return;
    }
    if (e.key === 'ArrowRight' && index + 1 < codes.length) {
      nextInput(index);
      return;
    }

    const pattern = /^\d$/;

    if (!pattern.test(e.key)) {
      return;
    }

    const newCode = e.key;
    const newCodes = [...codes.slice(0, index), newCode, ...codes.slice(index + 1)];
    setCodes(newCodes);

    if (index + 1 < codes.length) {
      nextInput(index);
    }

    onChange(newCodes.join(''));
    e.preventDefault();
  };

  const handleOnPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');

    const formattedData = pastedData.replace(/\D/g, '').slice(0, 6);
    const pattern = /^\d{0,6}$/;
    if (!pattern.test(formattedData) || formattedData.length === 0) {
      return;
    }

    const newCodes = formattedData.split('');

    setCodes(codes.map((_, index) => newCodes[index] || ''));

    const lastInput = document.getElementById(`code-${newCodes.length - 1}`);

    if (lastInput) {
      lastInput.focus();
    }
    onChange(formattedData);
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="flex flex-row items-center justify-center gap-2" onPaste={handleOnPaste}>
        {codes.map((value, index) => (
          <>
            {index === 3 && <span className="text-lg"> - </span>}
            <Input
              key={index}
              className="h-10 w-10 text-center text-lg leading-8 shadow-sm ring-1 ring-black/50 dark:bg-black/10 dark:ring-white/10 focus-within:dark:ring-ring"
              value={value}
              type="text"
              id={`code-${index}`}
              inputMode="numeric"
              maxLength={1}
              onChange={e => e.preventDefault()}
              onKeyDown={handleKeyDown(index)}
            />
          </>
        ))}
      </div>
      {errorMessage && <p className="mt-4 text-base text-destructive-foreground">{errorMessage}</p>}
    </div>
  );
};
