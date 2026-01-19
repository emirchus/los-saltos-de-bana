-- ============================================
-- Migración: Arreglar tipos en list_users_with_roles
-- ============================================
-- Esta migración arregla el problema de tipos en la función list_users_with_roles
-- donde auth.users.email es varchar(255) pero se espera TEXT
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
    p.username::TEXT,
    p.full_name::TEXT,
    au.email::TEXT,
    p.role_id::TEXT,
    r.name::TEXT,
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
