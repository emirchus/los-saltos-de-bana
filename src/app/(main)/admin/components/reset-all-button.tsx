'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { resetAllStats } from '../actions/reset-all-action';
import { useRouter } from 'next/navigation';

export function ResetAllButton() {
  const [isResetting, setIsResetting] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetAllStats();
      toast.success('Todos los puntos y estrellas han sido reseteados');
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al resetear los datos');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="lg">
          <AlertTriangle className="mr-2 h-4 w-4" />
          Resetear Todo
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            ¿Estás seguro?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Esta acción reseteará <strong>TODOS</strong> los puntos y estrellas de todos los usuarios en:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Puntos y estrellas globales (user_stats)</li>
              <li>Puntos de todas las sesiones (user_stats_session)</li>
            </ul>
            <p className="font-semibold text-destructive mt-4">
              Esta acción NO se puede deshacer.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isResetting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReset}
            disabled={isResetting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isResetting ? 'Reseteando...' : 'Sí, Resetear Todo'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
