export type ManagementStatusType = 'NEW' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export type ManagementMethodType = 'SUSPENDED' | 'DELETED';

export type ManagementListItem = {
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
  province: string;
  registrationCode: string;
  status: ManagementStatusType;
  street: string;
  type: string;
  uid: string;
  top: boolean;
};

export type ManagementDetailItem = {
  uid: string;
  type?: string;
  code: string;
  name: string;
  fullName: string;
  province: string;
  city: string;
  district: string;
  street: string;
  address: string;
  phone: string;
  enabled?: boolean;
  status: ManagementStatusType;
  upCode?: string;
  parent: { id?: number; uid?: string; name?: string };
  registrationCode?: string;
  createdBy?: string;
  createTime?: string;
  licenseNo?: string;
  updatedBy?: string;
  updateTime?: string;
};
