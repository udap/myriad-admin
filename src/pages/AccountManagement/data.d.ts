export type AccountManagementStatusType = 'NEW' | 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export type orgsType = {
  name: string;
  uid: string;
};

export type AccountManagementListItem = {
  cellphone: string;
  enabled: boolean;
  email: string;
  name: string;
  realName: string;
  sourceId: string;
  uid: string;
  orgs: orgsType[];
};

export type employeesType = {
  cellphone: string;
  code: string;
  desc: string;
  entryTime: string;
  name: string;
  org: {
    id: number;
    name: string;
    uid: string;
  };
  role: string;
  status: string;
  uid: string;
};

export type AccountDetailItem = {
  cellphone: string;
  createTime: string;
  createdBy: string;
  employees: employeesType[];
  enabled: boolean;
  name: string;
  uid: string;
  updateTime: string;
  updatedBy: string;
  org: {
    id: number;
    name: string;
    uid: string;
  };
  realName: string;
  email: string;
};
