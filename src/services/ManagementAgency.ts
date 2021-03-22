import { request } from 'umi';
import { api } from '@/utils/utils';

export type ManagementParamsType = {
  page: number;
  size?: number;
  status?: string;
  searchTxt: string;
};

// 机构列表
export async function queryAgency(params: ManagementParamsType) {
  return request(`${api}/organizations/search`, { params });
}

// 机构详情
export async function getOrganizations(uid: string) {
  return request(`${api}/organizations/${uid}`);
}

// 停用
export async function putSuspend(uid: string | undefined) {
  return request(`${api}/organizations/${uid}/suspend`, {
    method: 'PUT',
  });
}
// 注销
export async function managementDeleted(uid: string | undefined) {
  return request(`${api}/organizations/${uid}?force=true`, {
    method: 'DELETE',
  });
}
