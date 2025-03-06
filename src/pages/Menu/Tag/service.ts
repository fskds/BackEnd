import { request } from '@umijs/max';
import type { TagListItem, TagList } from './data.d';

export async function tag(params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<TagList>('/api/tag', {
    method: 'GET',
    params: {...params,},
    ...(options || {}),
  });
}

export async function addTag(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<any>('/api/tag/store', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateTag(
  params: {
    id: number;
  },
  body: TagListItem,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<any>(`/api/tag/${param0}/update`, {
    method: 'PUT',
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

export async function removeTag(params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<any>(`/api/tag/destroy`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function restoreTag(params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<any>(`/api/tag/restore`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function delTag(params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<any>(`/api/tag/force`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function tagData(params: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<{
    data: API.RequestDataList[]
  }>('/api/tag/data', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}