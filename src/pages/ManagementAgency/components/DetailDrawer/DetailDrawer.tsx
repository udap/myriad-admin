import React from 'react';
import { Drawer, Descriptions, Tag } from 'antd';
import ProCard from '@ant-design/pro-card';

import type { ManagementDetailItem } from '../../data';
import { agencyStatus, agencyStatusColor } from '@/utils/constant';

type DetailDrawerPropsType = {
  onClose: () => void;
  visible: boolean;
  loading: boolean;
  detail: ManagementDetailItem | undefined;
};

const DetailDrawer: React.FC<DetailDrawerPropsType> = (props) => {
  return (
    <Drawer
      width={480}
      title="详情"
      placement="right"
      closable={false}
      onClose={props.onClose}
      visible={props.visible}
      destroyOnClose
    >
      <ProCard title="机构详情" loading={props.loading} ghost collapsible>
        <Descriptions labelStyle={{ width: 120 }} size="small" bordered column={1}>
          <Descriptions.Item label="机构名">{props.detail?.fullName}</Descriptions.Item>
          <Descriptions.Item label="简称">{props.detail?.name}</Descriptions.Item>
          <Descriptions.Item label="状态">
            {props.detail?.status && (
              <Tag color={agencyStatusColor[props.detail?.status]}>
                {agencyStatus[props.detail?.status]}
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="编号">{props.detail?.code}</Descriptions.Item>
          <Descriptions.Item label="注册码">{props.detail?.registrationCode}</Descriptions.Item>
          <Descriptions.Item label="创建人账户">{props.detail?.createdBy}</Descriptions.Item>
          <Descriptions.Item label="联系电话">{props.detail?.phone}</Descriptions.Item>
          <Descriptions.Item label="详细地址">{`${props.detail?.province}${props.detail?.city}${props.detail?.district}${props.detail?.street}`}</Descriptions.Item>
          <Descriptions.Item label="银联商户码">{props.detail?.upCode}</Descriptions.Item>
          <Descriptions.Item label="营业执照">{props.detail?.licenseNo}</Descriptions.Item>
          <Descriptions.Item label="注册时间">{props.detail?.createTime}</Descriptions.Item>
          <Descriptions.Item label="最后修改人">{props.detail?.updatedBy}</Descriptions.Item>
          <Descriptions.Item label="最后修改时间">{props.detail?.updateTime}</Descriptions.Item>
        </Descriptions>
      </ProCard>
      <ProCard title="上级机构" loading={props.loading} ghost collapsible>
        {props.detail?.parent && (
          <Descriptions labelStyle={{ width: 120 }} size="small" bordered column={1}>
            {props.detail?.parent?.name && (
              <Descriptions.Item label="简称">{props.detail?.parent?.name}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </ProCard>
    </Drawer>
  );
};

export default DetailDrawer;
