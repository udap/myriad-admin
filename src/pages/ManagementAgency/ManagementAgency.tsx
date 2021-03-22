import React, { useState, useLayoutEffect, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Tag, Divider, notification } from 'antd';

import styles from './ManagementAgency.less';
import {
  queryAgency,
  getOrganizations,
  putSuspend,
  managementDeleted,
} from '@/services/ManagementAgency';
import type {
  ManagementStatusType,
  ManagementListItem,
  ManagementDetailItem,
  ManagementMethodType,
} from './data';
import { agencyStatus, agencyStatusColor } from '@/utils/constant';
import type { ManagementParamsType } from '@/services/ManagementAgency';
import { QueryForm, DetailDrawer, ManagementModal } from './components';

const { Column } = Table;

const CancellationAgency: React.FC = () => {
  const defaultPageIndex = 1;
  const defaultPageSize = 20;
  const [data, setData] = useState<ManagementListItem[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(defaultPageIndex);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [status, setStatus] = useState<ManagementStatusType | ''>('');
  const [searchTxt, setSearchTxt] = useState<string>('');
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [detail, setDetail] = useState<ManagementDetailItem>();
  const [managementVisible, setManagementVisible] = useState<boolean>(false);
  const [managementLoading, setManagementLoading] = useState<boolean>(false);
  const [managementDetail, setManagementDetail] = useState<ManagementListItem>();
  const [managementMethod, setManagementMethod] = useState<ManagementMethodType>('SUSPENDED');

  const fetchData = async (elements: ManagementParamsType) => {
    if (elements.searchTxt?.length < 2) {
      notification.error({ message: '搜索内容', description: '搜索框至少输入2个字符' });
      // 清空机构列表内容
      setData([]);
      setTotalElements(0);
      setPage(defaultPageIndex);
      setPageSize(defaultPageSize);
      return;
    }
    setPageLoading(true);
    try {
      const result = await queryAgency(elements);
      if (result.retcode === 0) {
        const arr: React.SetStateAction<ManagementListItem[]> = [];
        result.content?.content?.forEach((item: ManagementListItem) => {
          arr.push(item);
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
    setPageLoading(false);
  };

  const onPageChange = (_page: number, _pageSize?: number | undefined) => {
    setData([]);
    setTotalElements(0);

    setPage(_page);
    setPageSize(_pageSize ?? defaultPageSize);
  };

  const onSearchFinish = () => {
    setPage(defaultPageIndex);
    setPageSize(defaultPageSize);
    const params = { page: defaultPageIndex - 1, size: defaultPageSize, status, searchTxt };
    fetchData(params);
  };

  const onValuesChange = (changedValues: {
    status: ManagementStatusType | '';
    searchTxt: string;
  }) => {
    if (changedValues.status !== undefined) {
      setStatus(changedValues.status);
    }
    if (changedValues.searchTxt !== undefined) {
      setSearchTxt(changedValues.searchTxt);
    }
  };

  const onDetailChange = async (uid: string) => {
    setDetailVisible(true);

    setDetailLoading(true);
    try {
      const result = await getOrganizations(uid);
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

  const onSuspendedClick = async (elements: ManagementListItem) => {
    setManagementVisible(true);
    setManagementDetail(elements);
    setManagementMethod('SUSPENDED');
  };

  const onDeletedClick = async (elements: ManagementListItem) => {
    setManagementVisible(true);
    setManagementDetail(elements);
    setManagementMethod('DELETED');
  };

  const handleManagementOk = async () => {
    setManagementLoading(true);
    try {
      let result;
      switch (managementMethod) {
        case 'SUSPENDED':
          result = await putSuspend(managementDetail?.uid);
          break;
        case 'DELETED':
          result = await managementDeleted(managementDetail?.uid);
          break;

        default:
          break;
      }
      if (result.retcode === 0) {
        notification.success({
          message: `${agencyStatus[managementMethod]}！`,
          description: managementDetail?.name,
        });
      } else {
        notification.error({
          message: '操作失败！',
          description: result?.msg,
        });
      }
    } catch (error) {
      if (error.type !== 'HttpError') {
        notification.error({
          message: '系统内部错误，请联系管理员！',
          description: error.ReferenceError,
        });
      }
    }
    setManagementVisible(false);
    setManagementLoading(false);
    const params = { page: page - 1, size: pageSize, status, searchTxt };
    fetchData(params);
  };

  const handleManagementCancel = () => {
    setManagementVisible(false);
  };

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    // 页面首次加载不执行
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const params = { page: page - 1, size: pageSize, status, searchTxt };
    fetchData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className={styles.container}>
        <QueryForm
          status={status}
          searchTxt={searchTxt}
          loading={pageLoading}
          onFinish={onSearchFinish}
          onValuesChange={onValuesChange}
        />
        <Table
          dataSource={data}
          bordered
          rowKey={(record: { uid: string }) => record.uid}
          loading={pageLoading}
          pagination={{
            showSizeChanger: true,
            current: page,
            pageSize,
            total: totalElements,
            onChange: onPageChange,
            showTotal: (total) => `总共 ${total} 条数据`,
          }}
          scroll={{ x: 1900 }}
          size="small"
        >
          <Column
            title="机构名"
            dataIndex="fullName"
            key="fullName"
            fixed
            width={300}
            render={(text: React.ReactNode) => <a>{text}</a>}
          />
          <Column width={150} title="简称" dataIndex="name" key="name" />
          <Column width={150} title="编号" dataIndex="code" key="code" />
          <Column width={200} title="注册码" dataIndex="registrationCode" key="registrationCode" />
          <Column width={200} title="创建人账户" dataIndex="createdBy" key="createdBy" />
          <Column width={150} title="联系电话" dataIndex="phone" key="phone" />
          <Column title="详细地址" dataIndex="address" key="address" />
          <Column
            title="机构状态"
            dataIndex="status"
            key="status"
            width={90}
            align="center"
            fixed="right"
            render={(tag: ManagementStatusType) => (
              <Tag color={agencyStatusColor[tag]}>{agencyStatus[tag]}</Tag>
            )}
          />
          <Column
            title="操作"
            key="action"
            fixed="right"
            width={180}
            render={(text: ManagementListItem) => (
              <>
                <b className={styles.primaryPointer} onClick={() => onDetailChange(text.uid)}>
                  查看
                </b>
                {text.status !== 'NEW' && text.top && (
                  <>
                    {text.status !== 'SUSPENDED' && (
                      <>
                        <Divider type="vertical" />
                        <b
                          className={styles.suspendedPointer}
                          onClick={() => onSuspendedClick(text)}
                        >
                          停用
                        </b>
                      </>
                    )}
                    {text.status !== 'DELETED' && (
                      <>
                        <Divider type="vertical" />
                        <b className={styles.deletePointer} onClick={() => onDeletedClick(text)}>
                          注销
                        </b>
                      </>
                    )}
                  </>
                )}
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
      {managementVisible && (
        <ManagementModal
          visible={managementVisible}
          handleOk={handleManagementOk}
          confirmLoading={managementLoading}
          handleCancel={handleManagementCancel}
          detail={managementDetail}
          managementMethod={managementMethod}
        />
      )}
    </PageContainer>
  );
};

export default CancellationAgency;
