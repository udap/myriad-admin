import React from 'react';
import { Modal, Button, Input, Alert } from 'antd';

import styles from './ApprovalModal.less';
import type { ApprovalListItem } from '../../data';

type ApprovalModalPropsType = {
  visibleModal: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  handleDecline: () => void;
  details: ApprovalListItem | undefined;
  reason: string;
  onReasonChange: (e: any) => void;
  declineStatus: boolean;
  declineLoading: boolean;
  approvalLoading: boolean;
};

const ApprovalModal = (props: ApprovalModalPropsType) => {
  return (
    <Modal
      title="确认通过机构注册"
      visible={props.visibleModal}
      onOk={props.handleOk}
      onCancel={props.handleCancel}
      width={600}
      footer={[
        <Button key="back" danger loading={props.declineLoading} onClick={props.handleDecline}>
          拒绝
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={props.approvalLoading}
          onClick={props.handleOk}
        >
          同意
        </Button>,
      ]}
    >
      <div>{props.details?.fullName}</div>
      <div className={styles.declineReason}>
        理由：（选择”<span className={styles.declineAttention}>拒绝</span>“时，必须填写！）
      </div>
      <Input.TextArea
        rows={4}
        maxLength={255}
        value={props.reason}
        onChange={props.onReasonChange}
      />
      {props.declineStatus && <Alert message="请填写拒绝的理由！" type="error" showIcon />}
    </Modal>
  );
};

export default ApprovalModal;
