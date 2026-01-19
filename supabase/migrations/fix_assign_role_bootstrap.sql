-- ============================================
-- Migración: Permitir bootstrap de super_admin
-- ============================================
-- Esta migración modifica assign_role para permitir que un admin
-- pueda asignar super_admin si no existe ningún super_admin en el sistema
-- (para el bootstrap inicial)
-- ============================================

CREATE OR REPLACE FUNCTION public.assign_role(
  target_user_id UUID,
  new_role_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  super_admin_count INTEGER;
BEGIN
  -- Verificar que el usuario que ejecuta sea admin
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Solo los administradores pueden asignar roles';
  END IF;

  -- Verificar que el rol existe
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE id = new_role_id) THEN
    RAISE EXCEPTION 'El rol especificado no existe';
  END IF;

  -- Verificar si se está intentando asignar super_admin
  IF new_role_id = 'super_admin' THEN
    -- Contar cuántos super_admins existen
    SELECT COUNT(*) INTO super_admin_count
    FROM public.profiles p
    JOIN public.roles r ON p.role_id = r.id
    WHERE r.role_type = 'super_admin';

    -- Si no hay super_admins, permitir que un admin lo asigne (bootstrap)
    -- Si ya hay super_admins, solo otro super_admin puede asignarlo
    IF super_admin_count > 0 AND NOT public.is_super_admin() THEN
      RAISE EXCEPTION 'Solo los super administradores pueden asignar el rol de super administrador';
    END IF;
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

COMMENT ON FUNCTION public.assign_role IS 'Asigna un rol a un usuario. Los admins pueden asignar cualquier rol excepto super_admin (a menos que no exista ningún super_admin, permitiendo el bootstrap inicial).';
