import React from 'react';
import { Drawer, Descriptions, Tag, Table } from 'antd';
import ProCard from '@ant-design/pro-card';

import type { AccountDetailItem } from '../../data';

type DetailDrawerPropsType = {
  onClose: () => void;
  visible: boolean;
  loading: boolean;
  detail: AccountDetailItem | undefined;
};

const { Column } = Table;

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
      <ProCard title="账户详情" loading={props.loading} ghost collapsible>
        <Descriptions labelStyle={{ width: 120 }} size="small" bordered column={1}>
          <Descriptions.Item label="登录账号">{props.detail?.name}</Descriptions.Item>
          <Descriptions.Item label="姓名">{props.detail?.realName}</Descriptions.Item>
          <Descriptions.Item label="手机">{props.detail?.cellphone}</Descriptions.Item>
          <Descriptions.Item label="电子邮件">{props.detail?.email}</Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={props.detail?.enabled ? 'green' : 'red'}>
              {props.detail?.enabled ? '已启用' : '已停用'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="创建人账户">{props.detail?.createdBy}</Descriptions.Item>
          <Descriptions.Item label="注册时间">{props.detail?.createTime}</Descriptions.Item>
          <Descriptions.Item label="最后修改人">{props.detail?.updatedBy}</Descriptions.Item>
          <Descriptions.Item label="最后修改时间">{props.detail?.updateTime}</Descriptions.Item>
        </Descriptions>
      </ProCard>
      <ProCard title="注册机构" loading={props.loading} ghost collapsible>
        {props.detail?.org && (
          <Descriptions labelStyle={{ width: 120 }} size="small" bordered column={1}>
            {props.detail?.org?.name && (
              <Descriptions.Item label="机构名">{props.detail?.org?.name}</Descriptions.Item>
            )}
          </Descriptions>
        )}
      </ProCard>
      <ProCard title="所属机构" loading={props.loading} ghost collapsible>
        {props.detail?.employees && props.detail?.employees?.length > 0 && (
          <Table
            dataSource={props.detail?.employees}
            bordered
            rowKey={(record: { uid: string }) => record.uid}
            size="small"
            pagination={false}
          >
            <Column
              width={150}
              title="机构名"
              dataIndex="org"
              key="org"
              render={(text) => {
                return <div>{text.name}</div>;
              }}
            />
          </Table>
        )}
      </ProCard>
    </Drawer>
  );
};

export default DetailDrawer;
