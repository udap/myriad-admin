declare namespace API {
  export type CurrentUser = {
    admin: boolean;
    cellphone: string;
    employmentStatus: string;
    id: number;
    name: string;
    orgId: number;
    orgName: string;
    orgStatus: string;
    orgUid: string;
    platform: boolean;
    realName: string;
    uid: string;
    avatar?: string;
  };

  export type FetchUser = {
    content: {
      admin: boolean;
      cellphone: string;
      employmentStatus: string;
      id: number;
      name: string;
      orgId: number;
      orgName: string;
      orgStatus: string;
      orgUid: string;
      platform: boolean;
      realName: string;
      uid: string;
    };
    msg: string;
    retcode: number;
  };

  export type LoginStateType = {
    status?: 'ok' | 'error';
  };

  export type NoticeIconData = {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  };
}
