import { request } from '@umijs/max';
import type { AdminItem, AdminItemList, AdminRoleList, AdminPermissionList } from './data.d';

/** 获取管理员列表 GET /api/admin */
export async function admin(params: {current?: number;pageSize?: number;}, options?: { [key: string]: any },) {
  return request<AdminItemList>('/api/admin', {
    method: 'GET',
    params: {...params,},
    ...(options || {}),
  });
}
export async function addAdmin(params: { [key: string]: any },  body: AdminItem, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/admin/store', {
    method: 'POST',
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}
export async function updateAdmin(params: { id: number;}, body: AdminItem, options?: { [key: string]: any },) {
  const { id: param0 } = params;
  return request<Record<string, any>>(`/api/admin/${param0}/update`, {
    method: 'PUT',
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}
export async function removeAdmin(params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<Record<string, any>>(`/api/admin/destroy`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function restoreAdmin(params: { [key: string]: any }, options?: { [key: string]: any },) {
    console.log(params);
  return request<Record<string, any>>(`/api/admin/restore`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function delAdmin(params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<Record<string, any>>(`/api/admin/force`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function adminRole( params: {id: number;},options?: { [key: string]: any },) {
  const { id: param0 } = params;
  return request<AdminRoleList>(`/api/admin/${param0}/role`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
export async function assignRole(params: {id: number;},options?: { [key: string]: any },) {
  const { id: param0 } = params;
  return request<Record<string, any>>(`/api/admin/${param0}/assignRole`, {
    method: 'PUT',
    params: { ...params },
    ...(options || {}),
  });
}
export async function adminPermission(params: {id: number;},options?: { [key: string]: any },) {
  const { id: param0 } = params;
  return request<AdminPermissionList>(`/api/admin/${param0}/permission`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
export async function assignPermission(params: {id: number;},options?: { [key: string]: any },) {
  const { id: param0 } = params;
  return request<Record<string, any>>(`/api/admin/${param0}/assignPermission`, {
    method: 'PUT',
    params: { ...params },
    ...(options || {}),
  });
}

