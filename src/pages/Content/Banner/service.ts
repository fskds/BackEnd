import { request } from '@umijs/max';
import type { BannerListItem, BannerList } from './data.d';

export async function banner(params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<BannerList>('/api/banner', {
    method: 'GET',
    params: {...params,},
    ...(options || {}),
  });
}

export async function addBanner(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<any>('/api/banner/store', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateBanner(
  params: {
    id: number;
  },
  body: BannerListItem,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<any>(`/api/banner/${param0}/update`, {
    method: 'PUT',
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

export async function removeBanner(params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<any>(`/api/banner/destroy`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function restoreBanner(params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<any>(`/api/banner/restore`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function delBanner(params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<any>(`/api/banner/force`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function bannerData(params: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<{
    data: API.RequestDataList[]
  }>('/api/banner/data', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}