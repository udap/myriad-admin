import React from 'react';
import { Drawer, Descriptions, Tag } from 'antd';
import ProCard from '@ant-design/pro-card';

import type { ApprovalListItem } from '../../data';
import { approvalAgencyStatus, approvalAgencyStatusColor } from '@/utils/constant';

type DetailDrawerPropsType = {
  onClose: () => void;
  visible: boolean;
  visibleDetails: boolean;
  details: ApprovalListItem | undefined;
};

const DetailDrawer = (props: DetailDrawerPropsType) => {
  return (
    <Drawer
      width={480}
      title="详情"
      placement="right"
      closable={false}
      onClose={props.onClose}
      visible={props.visible}
    >
      <ProCard title="审批详情" loading={props.visibleDetails} ghost collapsible>
        <Descriptions labelStyle={{ width: 100 }} size="small" bordered column={1}>
          {props.details?.approvedBy && (
            <Descriptions.Item label="审批人">{props.details.approvedBy}</Descriptions.Item>
          )}
          <Descriptions.Item label="审批状态">
            {props.details?.approvedStatus && (
              <Tag color={approvalAgencyStatusColor[props.details?.approvedStatus]}>
                {approvalAgencyStatus[props.details?.approvedStatus]}
              </Tag>
            )}
          </Descriptions.Item>
          {props.details?.approvedStatus === 'DECLINED' && (
            <Descriptions.Item label="理由">{props.details?.approvedReason}</Descriptions.Item>
          )}
          {props.details?.approvedTime && (
            <Descriptions.Item label="审批时间">{props.details.approvedTime}</Descriptions.Item>
          )}
        </Descriptions>
      </ProCard>
      <ProCard title="机构详情" loading={props.visibleDetails} ghost collapsible>
        <Descriptions labelStyle={{ width: 100 }} size="small" bordered column={1}>
          <Descriptions.Item label="机构名">{props.details?.fullName}</Descriptions.Item>
          <Descriptions.Item label="简称">{props.details?.name}</Descriptions.Item>
          <Descriptions.Item label="编号">{props.details?.code}</Descriptions.Item>
          <Descriptions.Item label="注册码">{props.details?.registrationCode}</Descriptions.Item>
          <Descriptions.Item label="创建人">{props.details?.createdBy}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{props.details?.phone}</Descriptions.Item>
          <Descriptions.Item label="地址">{`${props.details?.province}${props.details?.city}${props.details?.district}${props.details?.street}`}</Descriptions.Item>
          <Descriptions.Item label="注册时间">{props.details?.createTime}</Descriptions.Item>
        </Descriptions>
      </ProCard>
    </Drawer>
  );
};

export default DetailDrawer;
