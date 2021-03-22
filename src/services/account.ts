import { request } from 'umi';
import { api } from '@/utils/utils';

export type AccountListType = {
  page: number;
  size?: number;
  searchTxt: string;
};

export async function accountSearch(params: AccountListType) {
  return request(`${api}/accounts/search`, { params });
}

export async function accountDetails(uid: string) {
  return request(`${api}/accounts/${uid}`);
}

export async function accountEnable(params: { uid: string; enable: boolean }) {
  return request(`${api}/accounts/${params.uid}/enable?value=${params.enable}`, { method: 'PUT' });
}

export async function accountPasswordSet(params: { uid: string | undefined; password: string }) {
  return request(`${api}/accounts/${params.uid}/password?new=${params.password}`, {
    method: 'PUT',
  });
}
