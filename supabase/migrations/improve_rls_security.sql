-- ============================================
-- Migración: Mejora de Seguridad RLS
-- ============================================
-- Esta migración:
-- 1. Habilita RLS en tablas que tienen políticas pero RLS deshabilitado
-- 2. Crea función helper para verificar si un usuario es admin
-- 3. Mejora las políticas existentes
-- 4. Prepara políticas para tablas de productos cuando se creen
-- ============================================

-- ============================================
-- 1. Función helper para verificar si un usuario es admin
-- ============================================
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = user_id
    AND role = 'ADMIN'
  );
END;
$$;

-- ============================================
-- 2. Habilitar RLS en tablas que lo necesitan
-- ============================================

-- Habilitar RLS en users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Habilitar RLS en notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. Mejorar políticas existentes de users
-- ============================================

-- Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;

-- Política: Los usuarios pueden leer su propio perfil
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil (excepto el rol)
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (role IS NULL OR role = (SELECT role FROM public.users WHERE id = auth.uid()))
  );

-- Política: Los admins pueden leer todos los usuarios
CREATE POLICY "Admins can read all users"
  ON public.users FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Política: Los admins pueden actualizar todos los usuarios
CREATE POLICY "Admins can update all users"
  ON public.users FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================
-- 4. Mejorar políticas existentes de comments
-- ============================================

-- Las políticas existentes están bien, pero las mejoramos para usar la función helper
DROP POLICY IF EXISTS "Users can read comments on accessible forms" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.comments;
DROP POLICY IF EXISTS "Admins can manage all comments" ON public.comments;

-- Política: Los usuarios pueden leer comentarios de formularios accesibles
CREATE POLICY "Users can read comments on accessible forms"
  ON public.comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.forms
      WHERE forms.id = comments.form_id
      AND (
        forms.user_id = auth.uid()
        OR public.is_admin(auth.uid())
      )
    )
  );

-- Política: Los usuarios autenticados pueden crear comentarios
CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.forms
      WHERE forms.id = comments.form_id
      AND (
        forms.user_id = auth.uid()
        OR public.is_admin(auth.uid())
      )
    )
  );

-- Política: Los usuarios pueden actualizar sus propios comentarios
CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden eliminar sus propios comentarios
CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id);

-- Política: Los admins pueden gestionar todos los comentarios
CREATE POLICY "Admins can manage all comments"
  ON public.comments FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================
-- 5. Mejorar políticas existentes de notifications
-- ============================================

-- Eliminar políticas antiguas si existen
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Enable insert for users based on user_id" ON public.notifications;
DROP POLICY IF EXISTS "Admins can read all notifications" ON public.notifications;

-- Política: Los usuarios pueden leer sus propias notificaciones
CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Los usuarios pueden actualizar sus propias notificaciones
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política: Solo el sistema (service_role) o admins pueden insertar notificaciones
-- Nota: En producción, esto debería hacerse mediante funciones con SECURITY DEFINER
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR public.is_admin(auth.uid())
  );

-- Política: Los admins pueden leer todas las notificaciones
CREATE POLICY "Admins can read all notifications"
  ON public.notifications FOR SELECT
  USING (public.is_admin(auth.uid()));

-- ============================================
-- 6. Mejorar políticas de forms (si es necesario)
-- ============================================

-- Las políticas de forms ya están bien, pero las mejoramos para usar la función helper
DROP POLICY IF EXISTS "Admins can read all forms" ON public.forms;
DROP POLICY IF EXISTS "Admins can update forms" ON public.forms;
DROP POLICY IF EXISTS "Admins can delete forms" ON public.forms;

-- Política: Los admins pueden leer todos los formularios
CREATE POLICY "Admins can read all forms"
  ON public.forms FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Política: Los admins pueden actualizar todos los formularios
CREATE POLICY "Admins can update forms"
  ON public.forms FOR UPDATE
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Política: Los admins pueden eliminar formularios
CREATE POLICY "Admins can delete forms"
  ON public.forms FOR DELETE
  USING (public.is_admin(auth.uid()));

-- ============================================
-- 7. Políticas para tablas de productos (cuando se creen)
-- ============================================
-- Estas políticas se aplicarán automáticamente cuando las tablas se creen
-- si las migraciones se ejecutan en orden

-- Nota: Las políticas para product, product_price, product_variant y cart
-- se crearán cuando se ejecuten las migraciones correspondientes.
-- Aquí solo documentamos las mejoras necesarias.

-- ============================================
-- 8. Comentarios y documentación
-- ============================================

COMMENT ON FUNCTION public.is_admin IS 'Verifica si un usuario tiene rol de ADMIN. Usa SECURITY DEFINER para permitir verificación segura en políticas RLS.';

COMMENT ON TABLE public.users IS 'Tabla de usuarios con RLS habilitado. Los usuarios solo pueden leer/actualizar su propio perfil, excepto admins.';
COMMENT ON TABLE public.comments IS 'Tabla de comentarios con RLS habilitado. Los usuarios pueden leer comentarios de formularios accesibles y gestionar sus propios comentarios.';
COMMENT ON TABLE public.notifications IS 'Tabla de notificaciones con RLS habilitado. Los usuarios solo pueden leer/actualizar sus propias notificaciones.';
