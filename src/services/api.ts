// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import type { CurrentAdmin } from './data.d';
/** 获取当前的用户 GET /api/currentAdmin */
export async function currentAdmin(options?: { [key: string]: any }) {
  return request<{
    data: CurrentAdmin;
  }>('/api/currentAdmin', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}
