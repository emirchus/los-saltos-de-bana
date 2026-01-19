'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface UserWithRole {
  user_id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  role_id: string | null;
  role_name: string | null;
  role_type: 'user' | 'moderator' | 'admin' | 'super_admin' | null;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  role_type: 'user' | 'moderator' | 'admin' | 'super_admin';
  is_system: boolean;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
}

/**
 * Obtiene todos los usuarios con sus roles
 */
export async function getUsersWithRoles(): Promise<UserWithRole[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('list_users_with_roles');

  if (error) {
    console.error('Error obteniendo usuarios con roles:', error);
    throw new Error(error.message);
  }

  return data || [];
}
/**
 * Obtiene todos los roles con sus permisos
 */
export async function getRoles(): Promise<Role[]> {
  const supabase = await createClient();

  // Obtener roles
  const { data: roles, error: rolesError } = await supabase.from('roles').select('*').order('name');

  if (rolesError) {
    console.error('Error obteniendo roles:', rolesError);
    throw new Error(rolesError.message);
  }

  // Obtener permisos
  const { data: permissions, error: permissionsError } = await supabase
    .from('permissions')
    .select('*')
    .order('resource, action');

  if (permissionsError) {
    console.error('Error obteniendo permisos:', permissionsError);
    throw new Error(permissionsError.message);
  }

  // Obtener relaciones roles-permisos
  const { data: rolePermissions, error: rpError } = await supabase
    .from('role_permissions')
    .select('*');

  if (rpError) {
    console.error('Error obteniendo role_permissions:', rpError);
    throw new Error(rpError.message);
  }

  // Combinar datos
  const rolesWithPermissions: Role[] = (roles || []).map(role => {
    const rolePerms = (rolePermissions || []).filter(rp => rp.role_id === role.id);
    const rolePermissionObjects = rolePerms
      .map(rp => permissions?.find(p => p.id === rp.permission_id))
      .filter((p) => p !== undefined);

    return {
      ...role,
      permissions: rolePermissionObjects,
    };
  });

  return rolesWithPermissions;
}

/**
 * Obtiene todos los permisos
 */
export async function getPermissions(): Promise<Permission[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('permissions').select('*').order('resource, action');

  if (error) {
    console.error('Error obteniendo permisos:', error);
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Asigna un rol a un usuario
 */
export async function assignRoleToUser(userId: string, roleId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('assign_role', {
    target_user_id: userId,
    new_role_id: roleId,
  });

  if (error) {
    console.error('Error asignando rol:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/roles');
  return data;
}

/**
 * Asigna un rol a un usuario por email
 */
export async function assignRoleByEmail(email: string, roleId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('assign_role_by_email', {
    user_email: email,
    new_role_id: roleId,
  });

  if (error) {
    console.error('Error asignando rol por email:', error);
    throw new Error(error.message);
  }

  revalidatePath('/admin/roles');
  return data;
}

/**
 * Verifica si el usuario actual es admin
 */
export async function checkIsAdmin(): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('is_admin');

  if (error) {
    console.error('Error verificando admin:', error);
    return false;
  }

  return data || false;
}

/**
 * Verifica si el usuario actual es super admin
 */
export async function checkIsSuperAdmin(): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('is_super_admin');

  if (error) {
    console.error('Error verificando super admin:', error);
    return false;
  }

  return data || false;
}
