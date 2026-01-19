-- ============================================
-- Helper: Funciones y Scripts para Asignar Roles
-- ============================================
-- Este archivo contiene funciones y ejemplos para asignar roles
-- a usuarios de manera segura
-- ============================================

-- ============================================
-- Función: Asignar rol a usuario por email
-- ============================================
-- Útil para asignar roles cuando conoces el email del usuario
CREATE OR REPLACE FUNCTION public.assign_role_by_email(
  user_email TEXT,
  new_role_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Verificar que el usuario que ejecuta sea admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Solo los administradores pueden asignar roles';
  END IF;
  
  -- Buscar el usuario por email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario con email % no encontrado', user_email;
  END IF;
  
  -- Asignar el rol usando la función existente
  RETURN public.assign_role(target_user_id, new_role_id);
END;
$$;

COMMENT ON FUNCTION public.assign_role_by_email IS 'Asigna un rol a un usuario buscándolo por email. Solo para admins.';

-- ============================================
-- Función: Asignar rol a usuario por username
-- ============================================
CREATE OR REPLACE FUNCTION public.assign_role_by_username(
  user_username TEXT,
  new_role_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Verificar que el usuario que ejecuta sea admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Solo los administradores pueden asignar roles';
  END IF;
  
  -- Buscar el usuario por username
  SELECT id INTO target_user_id
  FROM public.profiles
  WHERE username = user_username;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario con username % no encontrado', user_username;
  END IF;
  
  -- Asignar el rol usando la función existente
  RETURN public.assign_role(target_user_id, new_role_id);
END;
$$;

COMMENT ON FUNCTION public.assign_role_by_username IS 'Asigna un rol a un usuario buscándolo por username. Solo para admins.';

-- ============================================
-- Función: Listar usuarios con sus roles
-- ============================================
CREATE OR REPLACE FUNCTION public.list_users_with_roles()
RETURNS TABLE (
  user_id UUID,
  username TEXT,
  full_name TEXT,
  email TEXT,
  role_id TEXT,
  role_name TEXT,
  role_type public.user_role
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Solo admins pueden ver esta información
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Solo los administradores pueden listar usuarios con roles';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.username,
    p.full_name,
    au.email,
    p.role_id,
    r.name,
    r.role_type
  FROM public.profiles p
  LEFT JOIN public.roles r ON p.role_id = r.id
  LEFT JOIN auth.users au ON p.id = au.id
  ORDER BY 
    CASE r.role_type
      WHEN 'super_admin' THEN 1
      WHEN 'admin' THEN 2
      WHEN 'moderator' THEN 3
      WHEN 'user' THEN 4
    END,
    p.username;
END;
$$;

COMMENT ON FUNCTION public.list_users_with_roles IS 'Lista todos los usuarios con sus roles. Solo para admins.';

-- ============================================
-- Ejemplos de uso (comentados)
-- ============================================

-- Ejemplo 1: Asignar rol admin a un usuario por email
-- SELECT public.assign_role_by_email('usuario@ejemplo.com', 'admin');

-- Ejemplo 2: Asignar rol admin a un usuario por username
-- SELECT public.assign_role_by_username('nombre_usuario', 'admin');

-- Ejemplo 3: Asignar rol directamente por UUID
-- SELECT public.assign_role('uuid-del-usuario', 'admin');

-- Ejemplo 4: Listar todos los usuarios con sus roles
-- SELECT * FROM public.list_users_with_roles();

-- Ejemplo 5: Asignar super_admin (solo otro super_admin puede hacerlo)
-- SELECT public.assign_role('uuid-del-usuario', 'super_admin');

-- ============================================
-- Script para asignar múltiples roles a la vez
-- ============================================
-- Puedes usar este patrón para asignar roles a múltiples usuarios:

/*
DO $$
BEGIN
  -- Asignar admin a múltiples usuarios por email
  PERFORM public.assign_role_by_email('admin1@ejemplo.com', 'admin');
  PERFORM public.assign_role_by_email('admin2@ejemplo.com', 'admin');
  
  -- Asignar moderator a otros usuarios
  PERFORM public.assign_role_by_email('mod1@ejemplo.com', 'moderator');
  PERFORM public.assign_role_by_email('mod2@ejemplo.com', 'moderator');
END $$;
*/
