import { request } from 'umi';
import { api } from '@/utils/utils';

export type LoginParamsType = {
  username: string;
  password: string;
};

export async function getLogin(params: LoginParamsType) {
  return request(`${api}/login`, { params, getResponse: true, parseResponse: true });
}
