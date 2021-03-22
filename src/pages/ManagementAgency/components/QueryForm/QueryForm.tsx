import React from 'react';
import { Form, Row, Col, Select, Input, Button } from 'antd';

import styles from './QueryForm.less';
import type { ManagementStatusType } from '../../data';

type QueryFormPropsType = {
  status: ManagementStatusType | '';
  searchTxt: string;
  onValuesChange: ({
    status,
    searchTxt,
  }: {
    status: ManagementStatusType | '';
    searchTxt: string;
  }) => void;
  onFinish: (elements: any) => void;
  loading: boolean;
};

const QueryForm: React.FC<QueryFormPropsType> = (props) => {
  const [form] = Form.useForm();
  return (
    <Form
      className={styles.search}
      layout="inline"
      form={form}
      onFinish={props.onFinish}
      onValuesChange={props.onValuesChange}
      initialValues={{ status: props.status, searchTxt: props.searchTxt }}
    >
      <Row gutter={[16, 16]}>
        <Col>
          <Form.Item label="机构状态" name="status">
            <Select style={{ width: 120 }} loading={props.loading}>
              <Select.Option value="">所有</Select.Option>
              <Select.Option value="NEW">未审批</Select.Option>
              <Select.Option value="ACTIVE">已启用</Select.Option>
              <Select.Option value="SUSPENDED">已停用</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            label="搜索"
            name="searchTxt"
            tooltip="包括机构名、简称、编号、创建人账户、联系电话、注册码、银联商户码、营业执照号码"
          >
            <Input placeholder="请输入" value={props.searchTxt} allowClear />
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
