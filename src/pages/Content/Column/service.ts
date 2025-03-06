import { request } from '@umijs/max';
import type { ColumnListItem, ColumnList } from './data.d';

export async function column(params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<ColumnList>('/api/column', {
    method: 'GET',
    params: {...params,},
    ...(options || {}),
  });
}

export async function addColumn(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<any>('/api/column/store', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateColumn(
  params: {
    id: number;
  },
  body: ColumnListItem,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<any>(`/api/column/${param0}/update`, {
    method: 'PUT',
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

export async function removeColumn(params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<any>(`/api/column/destroy`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function restoreColumn(params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<any>(`/api/column/restore`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function delColumn(params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<any>(`/api/column/force`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function columnData(params: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<{
    data: API.RequestDataList[]
  }>('/api/column/data', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}