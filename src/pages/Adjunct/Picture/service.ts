import { request } from '@umijs/max';
import type { PictureListItem, PictureList } from './data.d';

export async function picture( params: {[key: string]: any }, options?: { [key: string]: any }) {
  return request<PictureList>('/api/adjunct/picture', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addPicture(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<any>('/api/adjunct/picture/store', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updatePicture(
  params: {
    id: number;
  },
  body: PictureListItem,
  options?: { [key: string]: any },
) {
  const { id: param0 } = params;
  return request<any>(`/api/adjunct/picture/${param0}/update`, {
    method: 'PUT',
    params: { ...params },
    data: body,
    ...(options || {}),
  });
}

export async function removePicture( params: { [key: string]: any }, options?: { [key: string]: any } ) {
  return request<any>(`/api/adjunct/picture/destroy`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function restorePicture(params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<any>(`/api/adjunct/picture/restore`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}
export async function delPicture(params: { [key: string]: any }, options?: { [key: string]: any },) {
  return request<any>(`/api/adjunct/picture/force`, {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}

export async function pictureData(params: { [key: string]: any },options?: { [key: string]: any }) {
  return request<{
    data: API.RequestDataList[]
  }>('/api/adjunct/picture/data', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function updateTemp( body: {[key: string]: any}, options?: { [key: string]: any },) {
  return request<API.tempUpdate>('/api/adjunct/temp/store', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}
export async function removeTemp(params: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/adjunct/temp/destroy', {
    method: 'DELETE',
    params: { ...params },
    ...(options || {}),
  });
}