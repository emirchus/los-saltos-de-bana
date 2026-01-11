'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { ChannelsSettings } from '../actions/channels-settings-action';
import { updateChannelsSettings } from '../actions/channels-settings-action';

interface ChannelsSettingsFormProps {
  settings: ChannelsSettings;
}

export function ChannelsSettingsForm({ settings: initialSettings }: ChannelsSettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updated = await updateChannelsSettings(settings.channel, {
        allow_commands_offstream: settings.allow_commands_offstream,
        base_points: settings.base_points,
        presente_cooldown_minutes: settings.presente_cooldown_minutes,
        presente_enabled: settings.presente_enabled,
        presente_points: settings.presente_points,
        wall_bonus_points: settings.wall_bonus_points,
        wall_boost_enabled: settings.wall_boost_enabled,
        wall_min_chars: settings.wall_min_chars,
      });

      setSettings(updated);
      toast.success('Configuración actualizada correctamente');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Canal: {settings.channel}</CardTitle>
        <CardDescription>Configuración del canal de Kick</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="base_points">Puntos Base</Label>
              <Input
                id="base_points"
                type="number"
                value={settings.base_points}
                onChange={e => setSettings({ ...settings, base_points: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presente_points">Puntos por Presente</Label>
              <Input
                id="presente_points"
                type="number"
                value={settings.presente_points}
                onChange={e => setSettings({ ...settings, presente_points: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="presente_cooldown_minutes">Cooldown de Presente (minutos)</Label>
              <Input
                id="presente_cooldown_minutes"
                type="number"
                value={settings.presente_cooldown_minutes}
                onChange={e => setSettings({ ...settings, presente_cooldown_minutes: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wall_bonus_points">Puntos Bonus del Muro</Label>
              <Input
                id="wall_bonus_points"
                type="number"
                value={settings.wall_bonus_points}
                onChange={e => setSettings({ ...settings, wall_bonus_points: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wall_min_chars">Mínimo de Caracteres del Muro</Label>
              <Input
                id="wall_min_chars"
                type="number"
                value={settings.wall_min_chars}
                onChange={e => setSettings({ ...settings, wall_min_chars: Number(e.target.value) })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="presente_enabled">Presente Habilitado</Label>
                <p className="text-sm text-muted-foreground">Permitir el comando !presente</p>
              </div>
              <Switch
                id="presente_enabled"
                checked={settings.presente_enabled}
                onCheckedChange={checked => setSettings({ ...settings, presente_enabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="wall_boost_enabled">Boost del Muro Habilitado</Label>
                <p className="text-sm text-muted-foreground">Activar el boost del muro</p>
              </div>
              <Switch
                id="wall_boost_enabled"
                checked={settings.wall_boost_enabled}
                onCheckedChange={checked => setSettings({ ...settings, wall_boost_enabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="allow_commands_offstream">Comandos Fuera de Stream</Label>
                <p className="text-sm text-muted-foreground">Permitir comandos cuando no hay stream activo</p>
              </div>
              <Switch
                id="allow_commands_offstream"
                checked={settings.allow_commands_offstream}
                onCheckedChange={checked => setSettings({ ...settings, allow_commands_offstream: checked })}
              />
            </div>
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
