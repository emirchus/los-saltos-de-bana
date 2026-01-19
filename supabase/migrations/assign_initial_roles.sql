-- ============================================
-- Migración: Asignar Roles Iniciales
-- ============================================
-- Esta migración asigna roles a usuarios existentes basándose en:
-- 1. Metadata de auth.users (role, is_admin)
-- 2. Email del usuario (para identificar admins principales)
-- ============================================

-- ============================================
-- 1. Asignar roles basándose en metadata existente
-- ============================================

-- Usuarios con metadata role = 'admin' o 'ADMIN' -> admin
UPDATE public.profiles p
SET role_id = 'admin'
FROM auth.users au
WHERE p.id = au.id
  AND p.role_id = 'user' -- Solo actualizar si aún no tiene rol asignado
  AND (
    (au.raw_user_meta_data->>'role')::text IN ('admin', 'ADMIN')
    OR (au.raw_user_meta_data->>'is_admin')::boolean = true
  );

-- Usuarios con metadata role = 'super_admin' -> super_admin
UPDATE public.profiles p
SET role_id = 'super_admin'
FROM auth.users au
WHERE p.id = au.id
  AND (au.raw_user_meta_data->>'role')::text = 'super_admin';

-- ============================================
-- 2. Asignar roles basándose en email (para admins principales)
-- ============================================
-- Si tienes emails específicos que deberían ser admins, puedes agregarlos aquí
-- Por ejemplo, el email bana-admin@losmaspiola.com debería ser admin

UPDATE public.profiles p
SET role_id = 'admin'
FROM auth.users au
WHERE p.id = au.id
  AND p.role_id = 'user' -- Solo actualizar si aún no tiene rol asignado
  AND au.email = 'bana-admin@losmaspiola.com';

-- ============================================
-- 3. Verificar y reportar asignaciones
-- ============================================

-- Crear una función temporal para reportar los cambios
DO $$
DECLARE
  admin_count INTEGER;
  super_admin_count INTEGER;
  user_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO admin_count FROM public.profiles WHERE role_id = 'admin';
  SELECT COUNT(*) INTO super_admin_count FROM public.profiles WHERE role_id = 'super_admin';
  SELECT COUNT(*) INTO user_count FROM public.profiles WHERE role_id = 'user';
  
  RAISE NOTICE 'Roles asignados:';
  RAISE NOTICE '  - Super Admin: %', super_admin_count;
  RAISE NOTICE '  - Admin: %', admin_count;
  RAISE NOTICE '  - User: %', user_count;
END $$;

-- ============================================
-- 4. Sincronizar roles con auth.users metadata
-- ============================================
-- Asegurar que auth.users metadata esté sincronizada con profiles.role_id

UPDATE auth.users au
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
  jsonb_build_object('role', p.role_id)
FROM public.profiles p
WHERE au.id = p.id
  AND (
    (au.raw_user_meta_data->>'role')::text IS DISTINCT FROM p.role_id
    OR au.raw_user_meta_data->>'role' IS NULL
  );

-- ============================================
-- 5. Comentarios
-- ============================================
COMMENT ON FUNCTION public.assign_role IS 'Esta migración asigna roles iniciales a usuarios existentes basándose en metadata y emails específicos.';
