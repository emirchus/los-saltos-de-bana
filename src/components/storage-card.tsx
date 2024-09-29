import { Card, CardContent } from '@/components/ui/card';

export function JumpNotFound() {
  return (
    <Card className="rounded-md text-xs shadow-sm">
      <CardContent className="flex items-start gap-2.5 p-2.5">
        <div className="grid flex-1 gap-1">
          <p className="font-medium">Faltan saltos?</p>
          <p className="text-muted-foreground">
            Si crees que falta algún salto, por favor contáctanos para que lo podamos agregar.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
