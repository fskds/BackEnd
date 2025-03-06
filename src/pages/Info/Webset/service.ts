import { request } from '@umijs/max';
import type { InfoItem, InfoItemList } from './data.d';

export async function basic (params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<InfoItemList>('/api/webinfo', {
    method: 'GET',
    params: {...params,},
    ...(options || {}),
  });
}

export async function addBasic(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<any>('/api/webinfo/store', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateBasic(
  params: {
    id: number;
  },
  body: InfoItem,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<any>(`/api/webinfo/${param0}/update`, {
    method: 'PUT',
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

export async function removeBasic(params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<any>(`/api/webinfo/destroy`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function restoreBasic(params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<any>(`/api/webinfo/restore`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function delBasic(params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<any>(`/api/webinfo/force`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function infoData(params: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<{
    data: API.RequestDataList[]
  }>('/api/webinfo/data', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}