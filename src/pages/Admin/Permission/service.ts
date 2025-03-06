import { request } from '@umijs/max';
import type { PermissionItem, PermissionItemList } from './data.d';

export async function permission( params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<PermissionItemList>('/api/permission', {
    method: 'GET',
    params: {...params,},
    ...(options || {}),
  });
}

export async function addPermission(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/permission/store', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updatePermission( params: {id: number;}, body: PermissionItem, options?: { [key: string]: any },) {
  const { id: param0 } = params;
  return request<Record<string, any>>(`/api/permission/${param0}/update`, {
    method: 'PUT',
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

export async function removePermission( params: {ids: number; }, options?: { [key: string]: any },) {
  return request<Record<string, any>>(`/api/permission/destroy`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function restorePermission(params: {ids: number;}, options?: { [key: string]: any },) {
  return request<Record<string, any>>(`/api/permission/restore`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function delPermission(params: {ids: number;}, options?: { [key: string]: any },) {
  return request<Record<string, any>>(`/api/permission/force`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function permissionData(params: {ids: number;}, options?: { [key: string]: any }) {
  return request<PermissionItemList>('/api/permission/data', {
    method: 'GET',
    ...(options || {}),
  });
}