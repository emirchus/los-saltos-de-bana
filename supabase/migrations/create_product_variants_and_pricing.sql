-- Modificar tabla product: agregar campos archived y low_stock_threshold
ALTER TABLE public.product
ADD COLUMN IF NOT EXISTS archived BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER NULL;

-- Modificar tabla product_price: agregar campos de precios promocional y por mayor
ALTER TABLE public.product_price
ADD COLUMN IF NOT EXISTS price_promo_ars NUMERIC NULL,
ADD COLUMN IF NOT EXISTS price_wholesale_ars NUMERIC NULL;

-- Crear tabla product_variant
CREATE TABLE IF NOT EXISTS public.product_variant (
    id BIGSERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES public.product(id) ON DELETE CASCADE,
    size TEXT NULL,
    color TEXT NULL,
    weight NUMERIC NULL,
    sku TEXT UNIQUE NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    low_stock_threshold INTEGER NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Crear índices para product_variant
CREATE INDEX IF NOT EXISTS idx_product_variant_product_id ON public.product_variant(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variant_sku ON public.product_variant(sku);

-- Habilitar RLS en product_variant
ALTER TABLE public.product_variant ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para product_variant
-- Los usuarios autenticados pueden leer variantes (para la tienda pública)
CREATE POLICY "Users can view product variants"
    ON public.product_variant FOR SELECT
    USING (true);

-- Solo admins pueden insertar, actualizar y eliminar variantes
-- Nota: En producción, deberías verificar un rol de admin específico
-- Por ahora, permitimos a usuarios autenticados (se puede restringir después)
CREATE POLICY "Authenticated users can manage product variants"
    ON public.product_variant FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Crear función para actualizar updated_at en product_variant
CREATE OR REPLACE FUNCTION update_product_variant_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_product_variant_updated_at
    BEFORE UPDATE ON public.product_variant
    FOR EACH ROW
    EXECUTE FUNCTION update_product_variant_updated_at();

-- Crear índice para búsqueda de productos archivados
CREATE INDEX IF NOT EXISTS idx_product_archived ON public.product(archived);
