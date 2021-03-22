import { request } from 'umi';
import { api } from '@/utils/utils';

export type ApprovalsParamsType = {
  page: number;
  size?: number;
  status?: string;
  searchTxt?: string;
};

// 机构列表
export async function queryApprovals(params: ApprovalsParamsType) {
  return request(`${api}/regApprovals`, { params });
}

// 机构详情
export async function queryApproval(id: number) {
  return request(`${api}/regApprovals/${id}`);
}

// 审批通过
export async function approval(id: number | undefined) {
  return request(`${api}/regApprovals/${id}/approval`, {
    method: 'PUT',
  });
}

// 审批拒绝
export async function decline(id: number | undefined, reason: string) {
  return request(`${api}/regApprovals/${id}/decline`, {
    method: 'PUT',
    data: { reason },
  });
}
