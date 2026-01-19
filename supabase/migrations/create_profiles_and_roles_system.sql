-- ============================================
-- Migración: Sistema de Perfiles y Roles
-- ============================================
-- Esta migración crea un sistema completo de roles y permisos:
-- 1. Tabla de roles con jerarquía
-- 2. Tabla de permisos
-- 3. Relación roles-permisos
-- 4. Campo role_id en profiles
-- 5. Funciones helper para gestionar roles
-- 6. Triggers para sincronizar con auth.users
-- 7. Políticas RLS apropiadas
-- ============================================

-- ============================================
-- 1. Crear enum para roles del sistema
-- ============================================
CREATE TYPE public.user_role AS ENUM (
  'user',        -- Usuario básico
  'moderator',   -- Moderador
  'admin',       -- Administrador
  'super_admin'  -- Super administrador
);

-- ============================================
-- 2. Crear tabla de permisos
-- ============================================
CREATE TABLE IF NOT EXISTS public.permissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  resource TEXT NOT NULL, -- Recurso al que aplica (ej: 'products', 'users', 'settings')
  action TEXT NOT NULL,   -- Acción permitida (ej: 'read', 'write', 'delete', 'manage')
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON public.permissions(resource);
CREATE INDEX IF NOT EXISTS idx_permissions_action ON public.permissions(action);

-- ============================================
-- 3. Crear tabla de roles
-- ============================================
CREATE TABLE IF NOT EXISTS public.roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  role_type public.user_role NOT NULL DEFAULT 'user',
  is_system BOOLEAN NOT NULL DEFAULT false, -- Roles del sistema no se pueden eliminar
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 4. Crear tabla de relación roles-permisos
-- ============================================
CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id TEXT NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id TEXT NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (role_id, permission_id)
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON public.role_permissions(permission_id);

-- ============================================
-- 5. Agregar campo role_id a profiles
-- ============================================
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role_id TEXT REFERENCES public.roles(id) ON DELETE SET NULL;

-- Índice para búsquedas por rol
CREATE INDEX IF NOT EXISTS idx_profiles_role_id ON public.profiles(role_id);

-- ============================================
-- 6. Insertar roles del sistema
-- ============================================
INSERT INTO public.roles (id, name, description, role_type, is_system) VALUES
  ('user', 'Usuario', 'Usuario básico del sistema', 'user', true),
  ('moderator', 'Moderador', 'Moderador con permisos limitados', 'moderator', true),
  ('admin', 'Administrador', 'Administrador con permisos completos', 'admin', true),
  ('super_admin', 'Super Administrador', 'Super administrador con todos los permisos', 'super_admin', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. Insertar permisos del sistema
-- ============================================
INSERT INTO public.permissions (id, name, description, resource, action) VALUES
  -- Permisos de productos
  ('products.read', 'Leer productos', 'Permite leer productos', 'products', 'read'),
  ('products.write', 'Escribir productos', 'Permite crear y editar productos', 'products', 'write'),
  ('products.delete', 'Eliminar productos', 'Permite eliminar productos', 'products', 'delete'),
  ('products.manage', 'Gestionar productos', 'Permite gestionar completamente productos', 'products', 'manage'),

  -- Permisos de usuarios
  ('users.read', 'Leer usuarios', 'Permite leer información de usuarios', 'users', 'read'),
  ('users.write', 'Escribir usuarios', 'Permite crear y editar usuarios', 'users', 'write'),
  ('users.delete', 'Eliminar usuarios', 'Permite eliminar usuarios', 'users', 'delete'),
  ('users.manage', 'Gestionar usuarios', 'Permite gestionar completamente usuarios', 'users', 'manage'),

  -- Permisos de roles
  ('roles.read', 'Leer roles', 'Permite leer roles y permisos', 'roles', 'read'),
  ('roles.write', 'Escribir roles', 'Permite crear y editar roles', 'roles', 'write'),
  ('roles.delete', 'Eliminar roles', 'Permite eliminar roles', 'roles', 'delete'),
  ('roles.manage', 'Gestionar roles', 'Permite gestionar completamente roles y permisos', 'roles', 'manage'),

  -- Permisos de configuración
  ('settings.read', 'Leer configuración', 'Permite leer configuración del sistema', 'settings', 'read'),
  ('settings.write', 'Escribir configuración', 'Permite modificar configuración del sistema', 'settings', 'write'),
  ('settings.manage', 'Gestionar configuración', 'Permite gestionar completamente la configuración', 'settings', 'manage'),

  -- Permisos de donaciones
  ('donations.read', 'Leer donaciones', 'Permite leer donaciones', 'donations', 'read'),
  ('donations.write', 'Escribir donaciones', 'Permite crear y editar donaciones', 'donations', 'write'),
  ('donations.manage', 'Gestionar donaciones', 'Permite gestionar completamente donaciones', 'donations', 'manage'),

  -- Permisos de estadísticas
  ('stats.read', 'Leer estadísticas', 'Permite leer estadísticas del sistema', 'stats', 'read'),
  ('stats.manage', 'Gestionar estadísticas', 'Permite gestionar estadísticas del sistema', 'stats', 'manage'),

  -- Permisos de canales
  ('channels.read', 'Leer canales', 'Permite leer información de canales', 'channels', 'read'),
  ('channels.write', 'Escribir canales', 'Permite crear y editar canales', 'channels', 'write'),
  ('channels.manage', 'Gestionar canales', 'Permite gestionar completamente canales', 'channels', 'manage')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 8. Asignar permisos a roles
-- ============================================
-- Usuario básico: solo lectura de productos y su propio perfil
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('user', 'products.read')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Moderador: lectura y escritura limitada
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('moderator', 'products.read'),
  ('moderator', 'products.write'),
  ('moderator', 'users.read'),
  ('moderator', 'channels.read'),
  ('moderator', 'channels.write'),
  ('moderator', 'donations.read')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Admin: casi todos los permisos excepto roles
INSERT INTO public.role_permissions (role_id, permission_id) VALUES
  ('admin', 'products.read'),
  ('admin', 'products.write'),
  ('admin', 'products.delete'),
  ('admin', 'products.manage'),
  ('admin', 'users.read'),
  ('admin', 'users.write'),
  ('admin', 'users.manage'),
  ('admin', 'settings.read'),
  ('admin', 'settings.write'),
  ('admin', 'donations.read'),
  ('admin', 'donations.write'),
  ('admin', 'donations.manage'),
  ('admin', 'stats.read'),
  ('admin', 'stats.manage'),
  ('admin', 'channels.read'),
  ('admin', 'channels.write'),
  ('admin', 'channels.manage')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Super Admin: todos los permisos
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 'super_admin', id FROM public.permissions
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- ============================================
-- 9. Asignar rol por defecto a usuarios existentes
-- ============================================
UPDATE public.profiles
SET role_id = 'user'
WHERE role_id IS NULL;

-- ============================================
-- 10. Habilitar RLS en las nuevas tablas
-- ============================================
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 11. Políticas RLS para permissions
-- ============================================
-- Todos pueden leer permisos (para ver qué permisos existen)
CREATE POLICY "Public can read permissions"
  ON public.permissions FOR SELECT
  USING (true);

-- Solo admins pueden gestionar permisos
CREATE POLICY "Admins can manage permissions"
  ON public.permissions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================
-- 12. Políticas RLS para roles
-- ============================================
-- Todos pueden leer roles
CREATE POLICY "Public can read roles"
  ON public.roles FOR SELECT
  USING (true);

-- Solo super admins pueden gestionar roles
CREATE POLICY "Super admins can manage roles"
  ON public.roles FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- ============================================
-- 13. Políticas RLS para role_permissions
-- ============================================
-- Todos pueden leer la relación roles-permisos
CREATE POLICY "Public can read role permissions"
  ON public.role_permissions FOR SELECT
  USING (true);

-- Solo super admins pueden gestionar la relación
CREATE POLICY "Super admins can manage role permissions"
  ON public.role_permissions FOR ALL
  USING (public.is_super_admin())
  WITH CHECK (public.is_super_admin());

-- ============================================
-- 14. Funciones helper para roles
-- ============================================

-- Función para obtener el rol de un usuario
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_role_id TEXT;
BEGIN
  SELECT role_id INTO user_role_id
  FROM public.profiles
  WHERE id = user_id;

  RETURN COALESCE(user_role_id, 'user');
END;
$$;

-- Función mejorada para verificar si un usuario es admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_role_type public.user_role;
BEGIN
  -- Primero verificar en profiles.role_id
  SELECT r.role_type INTO user_role_type
  FROM public.profiles p
  JOIN public.roles r ON p.role_id = r.id
  WHERE p.id = user_id;

  -- Si tiene rol admin o super_admin, retornar true
  IF user_role_type IN ('admin', 'super_admin') THEN
    RETURN true;
  END IF;

  -- Fallback: verificar en auth.users metadata (para compatibilidad)
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

-- Función para verificar si un usuario es super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_role_type public.user_role;
BEGIN
  SELECT r.role_type INTO user_role_type
  FROM public.profiles p
  JOIN public.roles r ON p.role_id = r.id
  WHERE p.id = user_id;

  RETURN user_role_type = 'super_admin';
END;
$$;

-- Función para verificar si un usuario tiene un permiso específico
CREATE OR REPLACE FUNCTION public.has_permission(
  permission_id TEXT,
  user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_role_id TEXT;
BEGIN
  -- Obtener el rol del usuario
  user_role_id := public.get_user_role(user_id);

  -- Super admin tiene todos los permisos
  IF user_role_id = 'super_admin' THEN
    RETURN true;
  END IF;

  -- Verificar si el rol tiene el permiso
  RETURN EXISTS (
    SELECT 1
    FROM public.role_permissions
    WHERE role_id = user_role_id
    AND permission_id = has_permission.permission_id
  );
END;
$$;

-- Función para verificar si un usuario tiene un permiso por recurso y acción
CREATE OR REPLACE FUNCTION public.has_permission_by_resource(
  resource_name TEXT,
  action_name TEXT,
  user_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_role_id TEXT;
BEGIN
  -- Obtener el rol del usuario
  user_role_id := public.get_user_role(user_id);

  -- Super admin tiene todos los permisos
  IF user_role_id = 'super_admin' THEN
    RETURN true;
  END IF;

  -- Verificar si el rol tiene el permiso
  RETURN EXISTS (
    SELECT 1
    FROM public.role_permissions rp
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE rp.role_id = user_role_id
    AND p.resource = resource_name
    AND p.action = action_name
  );
END;
$$;

-- Función para asignar un rol a un usuario (solo para admins)
CREATE OR REPLACE FUNCTION public.assign_role(
  target_user_id UUID,
  new_role_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Verificar que el usuario que ejecuta sea admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Solo los administradores pueden asignar roles';
  END IF;

  -- Verificar que el rol existe
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE id = new_role_id) THEN
    RAISE EXCEPTION 'El rol especificado no existe';
  END IF;

  -- Verificar que no se está intentando asignar super_admin (solo otros super_admins pueden)
  IF new_role_id = 'super_admin' AND NOT public.is_super_admin() THEN
    RAISE EXCEPTION 'Solo los super administradores pueden asignar el rol de super administrador';
  END IF;

  -- Actualizar el rol del usuario
  UPDATE public.profiles
  SET role_id = new_role_id
  WHERE id = target_user_id;

  -- Sincronizar con auth.users metadata
  UPDATE auth.users
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) ||
    jsonb_build_object('role', new_role_id)
  WHERE id = target_user_id;

  RETURN true;
END;
$$;

-- ============================================
-- 15. Triggers para sincronizar con auth.users
-- ============================================

-- Función trigger para sincronizar rol cuando se actualiza profile
CREATE OR REPLACE FUNCTION public.sync_role_to_auth_metadata()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Si cambió el role_id, actualizar auth.users metadata
  IF NEW.role_id IS DISTINCT FROM OLD.role_id THEN
    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) ||
      jsonb_build_object('role', NEW.role_id)
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$;

-- Crear trigger
DROP TRIGGER IF EXISTS sync_role_to_auth_metadata_trigger ON public.profiles;
CREATE TRIGGER sync_role_to_auth_metadata_trigger
  AFTER UPDATE OF role_id ON public.profiles
  FOR EACH ROW
  WHEN (NEW.role_id IS DISTINCT FROM OLD.role_id)
  EXECUTE FUNCTION public.sync_role_to_auth_metadata();

-- ============================================
-- 16. Función para actualizar updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.update_roles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_roles_updated_at_trigger
  BEFORE UPDATE ON public.roles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_roles_updated_at();

CREATE TRIGGER update_permissions_updated_at_trigger
  BEFORE UPDATE ON public.permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_roles_updated_at();

-- ============================================
-- 17. Comentarios y documentación
-- ============================================
COMMENT ON TABLE public.roles IS 'Roles del sistema con diferentes niveles de permisos';
COMMENT ON TABLE public.permissions IS 'Permisos disponibles en el sistema';
COMMENT ON TABLE public.role_permissions IS 'Relación muchos a muchos entre roles y permisos';
COMMENT ON COLUMN public.profiles.role_id IS 'Rol asignado al usuario. Por defecto es "user"';
COMMENT ON FUNCTION public.get_user_role IS 'Obtiene el ID del rol de un usuario';
COMMENT ON FUNCTION public.is_admin IS 'Verifica si un usuario es admin o super_admin';
COMMENT ON FUNCTION public.is_super_admin IS 'Verifica si un usuario es super_admin';
COMMENT ON FUNCTION public.has_permission IS 'Verifica si un usuario tiene un permiso específico';
COMMENT ON FUNCTION public.has_permission_by_resource IS 'Verifica si un usuario tiene un permiso por recurso y acción';
COMMENT ON FUNCTION public.assign_role IS 'Asigna un rol a un usuario (solo para admins)';
