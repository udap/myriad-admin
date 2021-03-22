export type ApprovalStatusType = 'NEW' | 'APPROVED' | 'DECLINED' | '';

export type ApprovalListItem = {
  address: string;
  city: string;
  code: string;
  createTime: string;
  createdBy: string;
  district: string;
  fullName: string;
  id: number;
  name: string;
  phone: string;
  private: true;
  province: string;
  registrationCode: string;
  approvedId: number;
  status: string;
  street: string;
  type: string;
  uid: string;
  licenseNo?: string;
  upCode?: string;
  approvedBy: string;
  approvedStatus: string;
  approvedReason: string;
  approvedTime: string;
};
