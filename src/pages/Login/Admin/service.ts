// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

import type { LoginParams, LoginResult, FakeCaptcha } from './data.d';
/** 登录接口 POST /api/login/account */
export async function login(body: LoginParams, options?: { [key: string]: any }) {
  body = {
      ...body,
      'grant_type' : 'password',
      'client_id' : 1,
      'client_secret' : 'i26MgkgvCSb71jL5d2ldKGBltV7bekGX57jrO3lo',
      'scope' : '',
  }
  return request<LoginResult>('/web/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 发送验证码 POST /api/login/captcha */
export async function getFakeCaptcha(
  params: {
    // query
    /** 手机号 */
    phone?: string;
  },
  options?: { [key: string]: any },
) {
  return request<FakeCaptcha>('/api/login/captcha', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}