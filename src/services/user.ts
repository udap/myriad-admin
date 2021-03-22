import { request } from 'umi';
import { api } from '@/utils/utils';

export async function queryCurrent() {
  return request<API.FetchUser>(`${api}/accounts/me`);
}
