import { request } from '@umijs/max';
import type { SectionList } from './data.d';

export async function section( params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<SectionList>('/api/section', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
export async function addSection( data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<any>('/api/section/store', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}
export async function updateSection(
  params: {
    id: number;
  },
  body: SectionListItem,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<any>(`/api/section/${param0}/update`, {
    method: 'PUT',
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}
export async function removeSection( params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<any>(`/api/section/destroy`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function restoreSection(params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<any>(`/api/section/restore`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function delSection(params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<any>(`/api/section/force`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
