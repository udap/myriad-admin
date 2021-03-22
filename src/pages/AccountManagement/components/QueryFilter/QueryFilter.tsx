import React from 'react';
import { Form, Row, Col, Button, Input } from 'antd';

import styles from './QueryFilter.less';

type QueryFilterPropsType = {
  loading: boolean;
  onFinish: (elements: { searchTxt: string }) => void;
  searchTxt: string;
};

const QueryFilter: React.FC<QueryFilterPropsType> = (props) => {
  const [form] = Form.useForm();
  return (
    <Form
      className={styles.container}
      layout="inline"
      form={form}
      onFinish={props.onFinish}
      initialValues={{ searchTxt: props.searchTxt }}
    >
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item
            label="搜索"
            name="searchTxt"
            tooltip="包括机构全名、账号手机号、账号邮箱、账号的名字、账号的原始编号、登陆号"
          >
            <Input placeholder="请输入" allowClear />
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

export default QueryFilter;
