import { Separator } from '@/components/ui/separator';
import { AppearanceForm } from './appearance-form';

export default function SettingsAppearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Apariencia</h3>
        <p className="text-sm text-muted-foreground">
          Personalizá la apariencia de la app. Cambiá automáticamente entre los temas de día y noche.
        </p>
      </div>
      <Separator />
      <AppearanceForm />
    </div>
  );
}
