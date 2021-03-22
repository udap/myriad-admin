import React from 'react';
import { Form, Row, Col, Select, Input, Button } from 'antd';

import styles from './QueryForm.less';
import type { ApprovalStatusType } from '../../data';
import type { ApprovalsParamsType } from '@/services/approvalAgency';

type QueryFormPropsType = {
  approvalStatus: ApprovalStatusType;
  searchTxtValue: string;
  onValuesChange: ({
    status,
    searchTxt,
  }: {
    status: ApprovalStatusType;
    searchTxt: string;
  }) => void;
  onFinish: (elements: ApprovalsParamsType) => void;
  loading: boolean;
};

const QueryForm: React.FC<QueryFormPropsType> = (props) => {
  const [form] = Form.useForm();
  return (
    <Form
      className={styles.search}
      layout="inline"
      form={form}
      initialValues={{ status: props.approvalStatus, searchTxt: props.searchTxtValue }}
      onValuesChange={props.onValuesChange}
      onFinish={props.onFinish}
    >
      <Row gutter={[16, 16]}>
        <Col>
          <Form.Item label="审批状态" name="status">
            <Select style={{ width: 120 }} loading={props.loading}>
              <Select.Option value="">所有</Select.Option>
              <Select.Option value="NEW">未审批</Select.Option>
              <Select.Option value="APPROVED">已同意</Select.Option>
              <Select.Option value="DECLINED">已拒绝</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="搜索"
            name="searchTxt"
            tooltip="包括机构名、简称、编号、创建人账户、联系电话、注册码、银联商户码、营业执照号码"
          >
            <Input placeholder="请输入" value={props.searchTxtValue} allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={props.loading}>
              查询
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default QueryForm;
