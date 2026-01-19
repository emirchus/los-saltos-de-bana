-- ============================================
-- Migración: Mejora Completa de Seguridad RLS
-- ============================================
-- Esta migración:
-- 1. Crea/actualiza función helper para verificar si un usuario es admin
-- 2. Habilita RLS en todas las tablas que lo necesitan
-- 3. Crea políticas apropiadas para cada tabla
-- 4. Mejora las políticas existentes que son demasiado permisivas
-- 5. Arregla funciones para que tengan search_path fijo
-- ============================================

-- ============================================
-- 1. Función helper para verificar si un usuario es admin
-- ============================================
-- Nota: Esta función verifica si el usuario tiene el rol 'admin' en sus metadata
-- Si necesitas otra forma de identificar admins, ajusta esta función
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Verificar si el usuario tiene rol admin en metadata de auth.users
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = user_id
    AND (
      (raw_user_meta_data->>'role')::text = 'admin'
      OR (raw_user_meta_data->>'role')::text = 'ADMIN'
      OR (raw_user_meta_data->>'is_admin')::boolean = true
    )
  );
END;
$$;

COMMENT ON FUNCTION public.is_admin IS 'Verifica si un usuario tiene rol de admin basado en metadata de auth.users. Usa SECURITY DEFINER para permitir verificación segura en políticas RLS.';

-- ============================================
-- 2. Arreglar funciones existentes con search_path
-- ============================================

-- Arreglar update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Arreglar update_product_variant_updated_at
CREATE OR REPLACE FUNCTION public.update_product_variant_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ============================================
-- 3. Habilitar RLS en tablas que lo necesitan
-- ============================================

-- Habilitar RLS en bingo_rooms (tiene políticas pero RLS deshabilitado)
ALTER TABLE public.bingo_rooms ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en channels
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en player_boards
ALTER TABLE public.player_boards ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en donation_status_history
ALTER TABLE public.donation_status_history ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en webhook_retry_queue
ALTER TABLE public.webhook_retry_queue ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en user_stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en user_stats_session
ALTER TABLE public.user_stats_session ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en stream_sessions
ALTER TABLE public.stream_sessions ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en channels_settings
ALTER TABLE public.channels_settings ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en product
ALTER TABLE public.product ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en product_price
ALTER TABLE public.product_price ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. Políticas para bingo_rooms
-- ============================================

-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.bingo_rooms;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bingo_rooms;
DROP POLICY IF EXISTS "Policy to implement Time To Live (TTL)" ON public.bingo_rooms;

-- Política: Usuarios autenticados pueden leer salas públicas y sus propias salas
CREATE POLICY "Users can read accessible bingo rooms"
  ON public.bingo_rooms FOR SELECT
  USING (
    privacity = 'public'::room_privacity
    OR created_by = auth.uid()
    OR public.is_admin()
  );

-- Política: Usuarios autenticados pueden crear salas
CREATE POLICY "Authenticated users can create bingo rooms"
  ON public.bingo_rooms FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND auth.role() = 'authenticated'
  );

-- Política: Solo el creador o admins pueden actualizar salas
CREATE POLICY "Room creators and admins can update bingo rooms"
  ON public.bingo_rooms FOR UPDATE
  USING (created_by = auth.uid() OR public.is_admin())
  WITH CHECK (created_by = auth.uid() OR public.is_admin());

-- Política: Solo el creador o admins pueden eliminar salas
CREATE POLICY "Room creators and admins can delete bingo rooms"
  ON public.bingo_rooms FOR DELETE
  USING (created_by = auth.uid() OR public.is_admin());

-- ============================================
-- 5. Políticas para messages
-- ============================================

-- Política: Usuarios autenticados pueden leer mensajes de canales accesibles
CREATE POLICY "Users can read messages in accessible channels"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.channels
      WHERE channels.id = messages.channel_id
      AND (
        channels.created_by = auth.uid()
        OR public.is_admin()
      )
    )
  );

-- Política: Usuarios autenticados pueden crear mensajes
CREATE POLICY "Authenticated users can create messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1
      FROM public.channels
      WHERE channels.id = messages.channel_id
    )
  );

-- Política: Usuarios pueden actualizar sus propios mensajes
CREATE POLICY "Users can update own messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios pueden eliminar sus propios mensajes, admins pueden eliminar cualquier mensaje
CREATE POLICY "Users can delete own messages, admins can delete any"
  ON public.messages FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- ============================================
-- 6. Políticas para channels
-- ============================================

-- Política: Usuarios autenticados pueden leer canales
CREATE POLICY "Authenticated users can read channels"
  ON public.channels FOR SELECT
  USING (auth.role() = 'authenticated');

-- Política: Usuarios autenticados pueden crear canales
CREATE POLICY "Authenticated users can create channels"
  ON public.channels FOR INSERT
  WITH CHECK (
    auth.uid() = created_by
    AND auth.role() = 'authenticated'
  );

-- Política: Solo el creador o admins pueden actualizar canales
CREATE POLICY "Channel creators and admins can update channels"
  ON public.channels FOR UPDATE
  USING (created_by = auth.uid() OR public.is_admin())
  WITH CHECK (created_by = auth.uid() OR public.is_admin());

-- Política: Solo el creador o admins pueden eliminar canales
CREATE POLICY "Channel creators and admins can delete channels"
  ON public.channels FOR DELETE
  USING (created_by = auth.uid() OR public.is_admin());

-- ============================================
-- 7. Políticas para player_boards
-- ============================================

-- Política: Usuarios pueden leer sus propios tableros
CREATE POLICY "Users can read own player boards"
  ON public.player_boards FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin());

-- Política: Usuarios pueden crear sus propios tableros
CREATE POLICY "Users can create own player boards"
  ON public.player_boards FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND auth.role() = 'authenticated'
  );

-- Política: Usuarios pueden actualizar sus propios tableros
CREATE POLICY "Users can update own player boards"
  ON public.player_boards FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Usuarios pueden eliminar sus propios tableros
CREATE POLICY "Users can delete own player boards"
  ON public.player_boards FOR DELETE
  USING (auth.uid() = user_id OR public.is_admin());

-- ============================================
-- 8. Políticas para donation_status_history
-- ============================================

-- Política: Solo admins y service_role pueden leer el historial
CREATE POLICY "Admins can read donation status history"
  ON public.donation_status_history FOR SELECT
  USING (public.is_admin());

-- Política: Solo service_role puede insertar historial (desde webhooks)
-- Nota: Esto se hace típicamente desde funciones con SECURITY DEFINER
CREATE POLICY "Service role can insert donation status history"
  ON public.donation_status_history FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- 9. Políticas para webhook_retry_queue
-- ============================================

-- Política: Solo service_role puede acceder a la cola de reintentos
CREATE POLICY "Service role can manage webhook retry queue"
  ON public.webhook_retry_queue FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- 10. Políticas para user_stats
-- ============================================

-- Política: Usuarios pueden leer sus propias estadísticas
CREATE POLICY "Users can read own stats"
  ON public.user_stats FOR SELECT
  USING (
    user_id = auth.uid()::text
    OR public.is_admin()
  );

-- Política: Solo service_role puede insertar/actualizar estadísticas
CREATE POLICY "Service role can manage user stats"
  ON public.user_stats FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- 11. Políticas para user_stats_session
-- ============================================

-- Política: Usuarios pueden leer sus propias estadísticas de sesión
CREATE POLICY "Users can read own session stats"
  ON public.user_stats_session FOR SELECT
  USING (
    user_id = auth.uid()::text
    OR public.is_admin()
  );

-- Política: Solo service_role puede insertar/actualizar estadísticas de sesión
CREATE POLICY "Service role can manage session stats"
  ON public.user_stats_session FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- 12. Políticas para stream_sessions
-- ============================================

-- Política: Usuarios autenticados pueden leer sesiones de stream
CREATE POLICY "Authenticated users can read stream sessions"
  ON public.stream_sessions FOR SELECT
  USING (auth.role() = 'authenticated');

-- Política: Solo service_role puede insertar/actualizar sesiones
CREATE POLICY "Service role can manage stream sessions"
  ON public.stream_sessions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- 13. Políticas para channels_settings
-- ============================================

-- Política: Usuarios autenticados pueden leer configuraciones
CREATE POLICY "Authenticated users can read channel settings"
  ON public.channels_settings FOR SELECT
  USING (auth.role() = 'authenticated');

-- Política: Solo admins pueden modificar configuraciones
CREATE POLICY "Admins can manage channel settings"
  ON public.channels_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 14. Políticas para product
-- ============================================

-- Política: Todos pueden leer productos no archivados (para la tienda pública)
CREATE POLICY "Public can read active products"
  ON public.product FOR SELECT
  USING (archived = false OR public.is_admin());

-- Política: Solo admins pueden insertar productos
CREATE POLICY "Admins can insert products"
  ON public.product FOR INSERT
  WITH CHECK (public.is_admin());

-- Política: Solo admins pueden actualizar productos
CREATE POLICY "Admins can update products"
  ON public.product FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Política: Solo admins pueden eliminar productos
CREATE POLICY "Admins can delete products"
  ON public.product FOR DELETE
  USING (public.is_admin());

-- ============================================
-- 15. Políticas para product_price
-- ============================================

-- Política: Todos pueden leer precios (para la tienda pública)
CREATE POLICY "Public can read product prices"
  ON public.product_price FOR SELECT
  USING (true);

-- Política: Solo admins pueden modificar precios
CREATE POLICY "Admins can manage product prices"
  ON public.product_price FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 16. Mejorar políticas existentes de product_variant
-- ============================================

-- Eliminar política demasiado permisiva
DROP POLICY IF EXISTS "Authenticated users can manage product variants" ON public.product_variant;

-- Política: Solo admins pueden insertar variantes
CREATE POLICY "Admins can insert product variants"
  ON public.product_variant FOR INSERT
  WITH CHECK (public.is_admin());

-- Política: Solo admins pueden actualizar variantes
CREATE POLICY "Admins can update product variants"
  ON public.product_variant FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Política: Solo admins pueden eliminar variantes
CREATE POLICY "Admins can delete product variants"
  ON public.product_variant FOR DELETE
  USING (public.is_admin());

-- ============================================
-- 17. Mejorar políticas existentes de donations
-- ============================================

-- La política de INSERT anónimo es necesaria para donaciones, pero la mejoramos
-- para validar que los datos sean razonables
DROP POLICY IF EXISTS "Allow anonymous inserts on donations" ON public.donations;

CREATE POLICY "Allow anonymous inserts on donations"
  ON public.donations FOR INSERT
  WITH CHECK (
    amount > 0
    AND (username IS NOT NULL OR is_anonymous = true)
    AND external_reference IS NOT NULL
  );

-- ============================================
-- 18. Mejorar políticas existentes de environment_variables
-- ============================================

-- Estas tablas deberían ser solo para admins
DROP POLICY IF EXISTS "Allow authenticated users to insert environment_variables" ON public.environment_variables;
DROP POLICY IF EXISTS "Allow authenticated users to update environment_variables" ON public.environment_variables;
DROP POLICY IF EXISTS "Allow authenticated users to read environment_variables" ON public.environment_variables;

CREATE POLICY "Admins can read environment variables"
  ON public.environment_variables FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can manage environment variables"
  ON public.environment_variables FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 19. Mejorar políticas existentes de integration_credentials
-- ============================================

-- Estas tablas deberían ser solo para admins
DROP POLICY IF EXISTS "Allow authenticated users to insert integration_credentials" ON public.integration_credentials;
DROP POLICY IF EXISTS "Allow authenticated users to update integration_credentials" ON public.integration_credentials;
DROP POLICY IF EXISTS "Allow authenticated users to read integration_credentials" ON public.integration_credentials;

CREATE POLICY "Admins can read integration credentials"
  ON public.integration_credentials FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can manage integration credentials"
  ON public.integration_credentials FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 20. Mejorar políticas existentes de integration_status
-- ============================================

-- Estas tablas deberían ser solo para admins
DROP POLICY IF EXISTS "Allow authenticated users to insert integration_status" ON public.integration_status;
DROP POLICY IF EXISTS "Allow authenticated users to update integration_status" ON public.integration_status;
DROP POLICY IF EXISTS "Allow authenticated users to read integration_status" ON public.integration_status;

CREATE POLICY "Admins can read integration status"
  ON public.integration_status FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can manage integration status"
  ON public.integration_status FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 21. Comentarios y documentación
-- ============================================

COMMENT ON TABLE public.bingo_rooms IS 'Salas de bingo con RLS habilitado. Los usuarios pueden leer salas públicas y gestionar sus propias salas.';
COMMENT ON TABLE public.messages IS 'Mensajes con RLS habilitado. Los usuarios pueden leer mensajes de canales accesibles y gestionar sus propios mensajes.';
COMMENT ON TABLE public.channels IS 'Canales con RLS habilitado. Los usuarios autenticados pueden leer canales y gestionar sus propios canales.';
COMMENT ON TABLE public.player_boards IS 'Tableros de jugadores con RLS habilitado. Los usuarios solo pueden acceder a sus propios tableros.';
COMMENT ON TABLE public.donation_status_history IS 'Historial de estados de donaciones. Solo accesible para admins y service_role.';
COMMENT ON TABLE public.webhook_retry_queue IS 'Cola de reintentos de webhooks. Solo accesible para service_role.';
COMMENT ON TABLE public.user_stats IS 'Estadísticas de usuarios. Los usuarios pueden leer sus propias estadísticas.';
COMMENT ON TABLE public.user_stats_session IS 'Estadísticas de sesión de usuarios. Los usuarios pueden leer sus propias estadísticas.';
COMMENT ON TABLE public.stream_sessions IS 'Sesiones de stream. Los usuarios autenticados pueden leer sesiones.';
COMMENT ON TABLE public.channels_settings IS 'Configuraciones de canales. Solo admins pueden modificar.';
COMMENT ON TABLE public.product IS 'Productos con RLS habilitado. Público puede leer productos activos, solo admins pueden gestionar.';
COMMENT ON TABLE public.product_price IS 'Precios de productos con RLS habilitado. Público puede leer, solo admins pueden gestionar.';
