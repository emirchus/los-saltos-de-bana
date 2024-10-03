'use client';

import React from 'react';

import TwitchButton from './twitch-button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface SignInAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SignInAlert = ({ open, onOpenChange }: SignInAlertProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Inicia sesión!</AlertDialogTitle>
          <AlertDialogDescription>Necesitas iniciar sesión para acceder a esta funcionalidad.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction asChild>
            <TwitchButton />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
