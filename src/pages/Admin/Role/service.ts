import { request } from '@umijs/max';
import type { RoleItem, RoleItemList, RolePermissionList } from './data.d';

export async function role(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: RoleItem[];
    total?: number;
    success?: boolean;
  }>('/api/role', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
export async function addRole(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/role/store', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}
export async function updateRole(
  params: {
    id: number;
  },
  body: RoleItem,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<Record<string, any>>(`/api/role/${param0}/update`, {
    method: 'PUT',
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}
export async function removeRole( params: {id: number;},  options?: { [key: string]: any },) {
  return request<Record<string, any>>(`/api/role/destroy`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function restoreRole(params: {id: number;}, options?: { [key: string]: any },) {
  return request<Record<string, any>>(`/api/role/restore`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function delRole(params: {id: number;}, options?: { [key: string]: any },) {
  return request<Record<string, any>>(`/api/role/force`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function rolePermission(
  params: {
    id: number;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<RolePermissionList>(`/api/role/${param0}/permission`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
export async function assignPermission(
  params: {
    id: number;
  },
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  console.log(params);
  return request<Record<string, any>>(`/api/role/${param0}/assignPermission`, {
    method: 'PUT',
    params: { ...params },
    ...(options || {}),
  });
}
