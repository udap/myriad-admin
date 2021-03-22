import React from 'react';
import { Modal } from 'antd';

import type { ManagementListItem, ManagementMethodType } from '../../data';
import { agencyMethodStatus } from '@/utils/constant';

type ManagementModalType = {
  visible: boolean;
  handleOk: () => void;
  confirmLoading: boolean;
  handleCancel: () => void;
  detail: ManagementListItem | undefined;
  managementMethod: ManagementMethodType;
};

const ManagementModal: React.FC<ManagementModalType> = (props) => {
  return (
    <Modal
      title={`确定${agencyMethodStatus[props.managementMethod]}机构？`}
      visible={props.visible}
      onOk={props.handleOk}
      confirmLoading={props.confirmLoading}
      onCancel={props.handleCancel}
    >
      {props.detail?.fullName}
    </Modal>
  );
};

export default ManagementModal;
