import React from 'react';
import { Drawer, Form, Input, Button } from 'antd';

import type { AccountManagementListItem } from '../../data';

type PasswordSetType = {
  visible: boolean;
  onClose: () => void;
  onFinish: (elements: { password: string }) => void;
  data: AccountManagementListItem | undefined;
  loading: boolean;
};

const PasswordSet: React.FC<PasswordSetType> = (props) => {
  const [form] = Form.useForm();

  return (
    <Drawer
      width={480}
      title="密码重置"
      placement="right"
      closable={false}
      onClose={props.onClose}
      visible={props.visible}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={props.onFinish}
        initialValues={{
          name: props.data?.name,
        }}
      >
        <Form.Item label="登录账户" name="name">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          name="password"
          label="新密码"
          rules={[
            () => ({
              validator(_, value) {
                const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
                if (!pattern.test(value)) {
                  return Promise.reject(
                    new Error('密码必须是包含6-18位英文字母、数字、字符的组合'),
                  );
                }

                return Promise.resolve();
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password placeholder="请输入新的密码" />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="确认密码"
          dependencies={['password']}
          hasFeedback
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value, callback) {
                if (!value || getFieldValue('password') !== value) {
                  callback('两次输入的密码不匹配');
                }

                callback();
              },
            }),
          ]}
        >
          <Input.Password placeholder="请再次输入新密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={props.loading}>
            提交
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default PasswordSet;
