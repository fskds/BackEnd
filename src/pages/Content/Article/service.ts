import { request } from '@umijs/max';
import type { ArticleListItem, ArticleList } from './data.d';

export async function article(params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<ArticleList>('/api/article', {
    method: 'GET',
    params: {...params,},
    ...(options || {}),
  });
}

export async function addArticle(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<any>('/api/article/store', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateArticle(
  params: {
    id: number;
  },
  body: ArticleListItem,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<any>(`/api/article/${param0}/update`, {
    method: 'PUT',
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

export async function removeArticle(params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<any>(`/api/article/destroy`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function restoreArticle(params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<any>(`/api/article/restore`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function delArticle(params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<any>(`/api/article/force`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function baiduArticle(params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<any>(`/api/article/baidu`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function articleData(params: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<{
    data: API.RequestDataList[]
  }>('/api/article/data', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}