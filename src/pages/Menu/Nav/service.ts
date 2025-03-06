import { request } from '@umijs/max';
import type { NavItem, NavItemList } from './data.d';

export async function nav(params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<NavItemList>('/api/nav', {
    method: 'GET',
    params: {...params,},
    ...(options || {}),
  });
}

export async function addNav(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/nav/store', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateNav( params: {id: number;}, body: NavItem, options?: { [key: string]: any } ) {
  const { id: param0 } = params;
  return request<Record<string, any>>(`/api/nav/${param0}/update`, {
    method: 'PUT',
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

export async function removeNav(params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<Record<string, any>>('/api/nav/destroy', {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function restoreNav(params: {id: number;}, options?: { [key: string]: any } ) {
  const { id: param0 } = params;
  return request<Record<string, any>>(`/api/nav/restore/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function delNav(params: {id: number;}, options?: { [key: string]: any } ) {
  const { id: param0 } = params;
  return request<Record<string, any>>(`/api/nav/force/${param0}`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function navData(params: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<{data: API.RequestDataList[]}>('/api/nav/data', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}