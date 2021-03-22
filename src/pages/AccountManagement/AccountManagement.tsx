import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Tag, Divider, notification, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import styles from './AccountManagement.less';
import { QueryFilter, DetailDrawer, PasswordSet } from './components';
import type { AccountManagementListItem, orgsType, AccountDetailItem } from './data';
import {
  accountSearch,
  accountDetails,
  accountEnable,
  accountPasswordSet,
} from '@/services/account';
import type { AccountListType } from '@/services/account';

const { Column } = Table;

const AccountManagement = () => {
  const defaultPageIndex = 1;
  const defaultPageSize = 20;

  const [data, setData] = useState<AccountManagementListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(defaultPageIndex);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [searchTxt, setSearchTxt] = useState<string>('');

  const [detail, setDetail] = useState<AccountDetailItem>();
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<AccountManagementListItem>();
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);

  const fetchData = async (elements: AccountListType) => {
    if (elements.searchTxt?.length < 2) {
      notification.error({ message: '搜索内容', description: '搜索框至少输入2个字符' });
      return;
    }

    setLoading(true);
    try {
      const result = await accountSearch(elements);
      if (result.retcode === 0) {
        const arr: React.SetStateAction<AccountManagementListItem[]> = [];
        result.content?.content.forEach((item: AccountManagementListItem) => {
          const obj = {
            cellphone: item.cellphone,
            enabled: item.enabled,
            name: item.name,
            realName: item.realName,
            sourceId: item.sourceId,
            uid: item.uid,
            orgs: item.orgs,
            email: item.email,
          };
          arr.push(obj);
        });
        setData(arr);
        setTotalElements(result.content?.totalElements);
      } else {
        notification.error({ message: '列表查询失败！', description: result?.msg });
      }
    } catch (error) {
      if (error.type !== 'HttpError') {
        notification.error({
          message: '系统内部错误，请联系管理员！',
          description: error.ReferenceError,
        });
      }
    }
    setLoading(false);
  };

  // 查询按钮
  const onSearch = (elements: { searchTxt: string }) => {
    setPage(defaultPageIndex);
    setPageSize(defaultPageSize);
    setSearchTxt(elements.searchTxt);

    const params = {
      page: defaultPageIndex - 1,
      size: defaultPageSize,
      searchTxt: elements.searchTxt,
    };
    fetchData(params);
  };

  // 分页按钮
  const onPageChange = (_page: number, _pageSize?: number | undefined) => {
    setPage(_page);
    setPageSize(_pageSize ?? defaultPageSize);

    const params = {
      page: _page - 1,
      size: _pageSize ?? defaultPageSize,
      searchTxt,
    };
    fetchData(params);
  };

  const onDetailChange = async (element: string) => {
    setDetailVisible(true);

    setDetailLoading(true);
    try {
      const result = await accountDetails(element);
      if (result.retcode === 0) {
        setDetail(result?.content);
      } else {
        notification.error({ message: '详情查询失败！', description: result?.msg });
        setDetailVisible(false);
      }
    } catch (error) {
      if (error.type !== 'HttpError') {
        notification.error({
          message: '系统内部错误，请联系管理员！',
          description: error.ReferenceError,
        });
      }
    }
    setDetailLoading(false);
  };

  const onClose = () => {
    setDetailVisible(false);
  };

  // 操作：启用、停用
  const onEnableChange = (elements: AccountManagementListItem) => {
    Modal.confirm({
      title: `确定【${elements.enabled ? '停用' : '启用'}】账户？`,
      icon: <ExclamationCircleOutlined />,
      content: elements.name,
      async onOk() {
        try {
          const result = await accountEnable({ uid: elements.uid, enable: !elements.enabled });
          if (result.retcode === 0) {
            notification.success({
              message: `账户【${elements.enabled ? '停用' : '启用'}】成功！`,
            });
            const params = { page: page - 1, size: pageSize, searchTxt };
            fetchData(params);
          } else {
            notification.error({ message: '账户操作失败！', description: result?.msg });
          }
        } catch (error) {
          if (error.type !== 'HttpError') {
            notification.error({
              message: '系统内部错误，请联系管理员！',
              description: error.ReferenceError,
            });
          }
        }
      },
      onCancel() {},
    });
  };

  const onPasswordClose = () => {
    setPasswordVisible(false);
  };

  const onPasswordClick = (elements: AccountManagementListItem) => {
    setCurrentItem(elements);
    setPasswordVisible(true);
  };

  // 操作：重置密码
  const onPasswordFinish = async (elements: { password: string }) => {
    setPasswordLoading(true);
    try {
      const result = await accountPasswordSet({
        uid: currentItem?.uid,
        password: elements.password,
      });
      if (result.retcode === 0) {
        notification.success({ message: '密码重置成功' });
        const params = { page: page - 1, size: pageSize, searchTxt };
        fetchData(params);
        onPasswordClose();
      } else {
        notification.error({ message: '密码重置失败', description: result?.msg });
      }
    } catch (error) {
      if (error.type !== 'HttpError') {
        notification.error({
          message: '系统内部错误，请联系管理员！',
          description: error.ReferenceError,
        });
      }
    }
    setPasswordLoading(false);
  };

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className={styles.container}>
        <QueryFilter loading={loading} onFinish={onSearch} searchTxt={searchTxt} />
        <Table
          dataSource={data}
          bordered
          size="small"
          loading={loading}
          rowKey={(record: { uid: string }) => record.uid}
          pagination={{
            showSizeChanger: true,
            current: page,
            pageSize,
            total: totalElements,
            onChange: onPageChange,
            showTotal: (total) => `总共 ${total} 条数据`,
          }}
        >
          <Column title="登录账号" dataIndex="name" key="name" />
          <Column title="姓名" dataIndex="realName" key="realName" />
          <Column title="手机" dataIndex="cellphone" key="cellphone" />
          <Column title="电子邮件" dataIndex="email" key="email" />
          <Column
            title="所属机构"
            dataIndex="orgs"
            key="orgs"
            render={(text = []) =>
              text.map((item: orgsType) => <div key={item.uid}>{item.name}</div>)
            }
          />
          <Column
            title="状态"
            dataIndex="enabled"
            key="enabled"
            width={100}
            align="center"
            render={(tag: boolean) => (
              <Tag color={tag ? 'green' : 'red'}>{tag ? '已启用' : '已停用'}</Tag>
            )}
          />
          <Column
            title="操作"
            key="action"
            width={150}
            render={(text: AccountManagementListItem) => (
              <>
                <b className={styles.primaryPointer} onClick={() => onDetailChange(text.uid)}>
                  查看
                </b>

                <>
                  {!text.enabled && (
                    <>
                      <Divider type="vertical" />
                      <b className={styles.activePointer} onClick={() => onEnableChange(text)}>
                        启用
                      </b>
                    </>
                  )}
                  {text.enabled && (
                    <>
                      <Divider type="vertical" />
                      <b className={styles.suspendedPointer} onClick={() => onEnableChange(text)}>
                        停用
                      </b>
                    </>
                  )}
                  <>
                    <Divider type="vertical" />
                    <b className={styles.deletePointer} onClick={() => onPasswordClick(text)}>
                      密码
                    </b>
                  </>
                </>
              </>
            )}
          />
        </Table>
      </div>
      {detailVisible && (
        <DetailDrawer
          visible={detailVisible}
          loading={detailLoading}
          detail={detail}
          onClose={onClose}
        />
      )}
      {passwordVisible && (
        <PasswordSet
          visible={passwordVisible}
          onClose={onPasswordClose}
          onFinish={onPasswordFinish}
          data={currentItem}
          loading={passwordLoading}
        />
      )}
    </PageContainer>
  );
};

export default AccountManagement;
