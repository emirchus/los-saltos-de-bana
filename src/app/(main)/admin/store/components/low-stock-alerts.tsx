'use client';

import { AlertTriangle, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LowStockAlert } from '../actions/products-admin-action';
import { getLowStockAlerts } from '../actions/products-admin-action';

interface LowStockAlertsProps {
  onProductClick?: (productId: number) => void;
}

export function LowStockAlerts({ onProductClick }: LowStockAlertsProps) {
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await getLowStockAlerts();
      setAlerts(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar alertas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Stock Bajo</CardTitle>
          <CardDescription>Productos y variantes con stock bajo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">Cargando alertas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Stock Bajo</CardTitle>
          <CardDescription>Productos y variantes con stock bajo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">No hay alertas de stock bajo</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Alertas de Stock Bajo
            </CardTitle>
            <CardDescription>Productos y variantes con stock bajo ({alerts.length})</CardDescription>
          </div>
          <Badge variant="destructive">{alerts.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={`${alert.product.id}-${alert.variant?.id || 'product'}-${index}`}
              className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-3"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{alert.product.name}</span>
                  {alert.variant && (
                    <Badge variant="outline" className="text-xs">
                      {alert.variant.sku}
                    </Badge>
                  )}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {alert.variant ? (
                    <>
                      Variante: {alert.variant.sku} - Stock: {alert.stock} / Umbral: {alert.threshold}
                    </>
                  ) : (
                    <>
                      Stock: {alert.stock} / Umbral: {alert.threshold}
                    </>
                  )}
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => onProductClick?.(alert.product.id)}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Ver Producto
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
