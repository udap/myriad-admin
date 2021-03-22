import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Tag, Divider, notification } from 'antd';

import styles from './ApprovalAgency.less';
import { queryApprovals, queryApproval, approval, decline } from '@/services/approvalAgency';
import { approvalAgencyStatus, approvalAgencyStatusColor } from '@/utils/constant';
import type { ApprovalsParamsType } from '@/services/approvalAgency';
import { QueryForm, DetailDrawer, ApprovalModal } from './components';
import type { ApprovalStatusType, ApprovalListItem } from './data';

const { Column } = Table;

const ApprovalAgency: React.FC = () => {
  const defaultPageSize = 20;
  const defaultStatus = 'NEW';
  const [data, setData] = useState<ApprovalListItem[]>([]);
  const [declineLoading, setDeclineLoading] = useState<boolean>(false);
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleDetails, setVisibleDetails] = useState<boolean>(false);
  const [details, setDetails] = useState<ApprovalListItem>();
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [size, setSize] = useState<number>(defaultPageSize);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatusType>(defaultStatus);
  const [searchTxtValue, setSearchTxtValue] = useState<string>('');
  const [declineStatus, setDeclineStatus] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');

  const fetchData = async (params: ApprovalsParamsType) => {
    setLoading(true);
    try {
      const result = await queryApprovals(params);

      const listDataSource: any[] = [];
      if (result.retcode === 0) {
        result.content.content.forEach(
          (item: { org: any; id: number; status: ApprovalStatusType }) => {
            const { province, city, district, street } = item.org;
            listDataSource.push({
              ...item.org,
              approvedId: item.id,
              address: `${province}${city}${district}${street}`,
              approvedStatus: item.status,
            });
          },
        );
        setTotalElements(result.content.totalElements);
      } else {
        notification.error({ message: '列表查询失败！', description: result?.msg });
      }
      setData(listDataSource);
      setPageIndex(params?.page + 1);
      setSize(params?.size || defaultPageSize);
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

  const showDrawer = async (id: number) => {
    setVisible(true);

    setVisibleDetails(true);
    try {
      const result = await queryApproval(id);

      if (result.retcode === 0) {
        setDetails({
          ...result.content.metadata.org,
          approvedId: id,
          approvedBy: result.content.approvedBy,
          approvedStatus: result.content.status,
          approvedReason: result.content.reason,
          approvedTime: result.content.approvedTime,
        });
      } else {
        notification.error({ message: '详情查询失败！', description: result?.msg });
        setVisible(false);
      }
    } catch (error) {
      if (error.type !== 'HttpError') {
        notification.error({
          message: '系统内部错误，请联系管理员！',
          description: error.ReferenceError,
        });
      }
      setVisible(false);
    }
    setVisibleDetails(false);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onApproval = (elements: ApprovalListItem) => {
    setDetails(elements);
    setVisibleModal(true);
  };

  useEffect(() => {
    const params = { page: 0, size: defaultPageSize, status: defaultStatus, searchTxt: '' };
    fetchData(params);
  }, []);

  const onValuesChange = ({
    status,
    searchTxt,
  }: {
    status: ApprovalStatusType;
    searchTxt: string;
  }) => {
    if (status !== undefined) {
      setApprovalStatus(status);
    }
    if (searchTxt !== undefined) {
      setSearchTxtValue(searchTxt);
    }
  };

  const onFinish = (elements: ApprovalsParamsType) => {
    const params = {
      page: 0,
      size,
      status: elements.status,
      searchTxt: elements.searchTxt,
    };
    fetchData(params);
  };

  const onPageChange = (page: number, pageSize?: number | undefined) => {
    setData([]);
    setTotalElements(0);

    const params = {
      page: page - 1,
      size: pageSize,
      status: approvalStatus,
      searchTxt: searchTxtValue,
    };
    fetchData(params);
  };

  const handleOk = async () => {
    setApprovalLoading(true);
    try {
      const result = await approval(details?.approvedId);
      if (result.retcode === 0) {
        notification.success({
          message: '机构审批，已同意！',
          description: details?.fullName,
        });
        setVisibleModal(false);
        const params = {
          page: pageIndex - 1,
          size,
          status: approvalStatus,
          searchTxt: searchTxtValue,
        };
        fetchData(params);
      } else {
        notification.error({
          message: '机构审批，失败',
          description: result.msg,
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
    setApprovalLoading(false);
  };

  const handleDecline = async () => {
    if (!reason) {
      setDeclineStatus(true);
      return;
    }
    setDeclineLoading(true);
    try {
      const result = await decline(details?.approvedId, reason);
      setDeclineLoading(false);
      if (result.retcode === 0) {
        notification.success({
          message: '机构审批，已拒绝！',
          description: details?.fullName,
        });
        setVisibleModal(false);
        const params = {
          page: pageIndex - 1,
          size,
          status: approvalStatus,
          searchTxt: searchTxtValue,
        };
        fetchData(params);
      } else {
        notification.error({
          message: '机构审批，失败',
          description: result.msg,
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
    setDeclineLoading(false);
  };

  const onReasonChange = (e: any) => {
    if (declineStatus) setDeclineStatus(false);
    setReason(e.target.value);
  };

  const handleCancel = () => {
    setVisibleModal(false);
    setReason('');
  };

  return (
    <PageContainer header={{ breadcrumb: undefined }}>
      <div className={styles.container}>
        <QueryForm
          approvalStatus={approvalStatus}
          searchTxtValue={searchTxtValue}
          onValuesChange={onValuesChange}
          onFinish={onFinish}
          loading={loading}
        />
        <Table
          dataSource={data}
          rowKey={(record: { approvedId: number }) => record.approvedId}
          bordered
          pagination={{
            showSizeChanger: true,
            current: pageIndex,
            pageSize: size,
            total: totalElements,
            onChange: onPageChange,
            showTotal: (total) => `总共 ${total} 条数据`,
          }}
          loading={loading}
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
            title="审批状态"
            dataIndex="approvedStatus"
            key="approvedStatus"
            width={90}
            align="center"
            fixed="right"
            render={(tag: ApprovalStatusType) => (
              <Tag color={approvalAgencyStatusColor[tag]}>{approvalAgencyStatus[tag]}</Tag>
            )}
          />
          <Column
            title="操作"
            key="action"
            fixed="right"
            width={120}
            render={(text: ApprovalListItem) => {
              return (
                <>
                  <b className={styles.primaryPointer} onClick={() => showDrawer(text.approvedId)}>
                    查看
                  </b>
                  {text.approvedStatus === 'NEW' && (
                    <>
                      <Divider type="vertical" />
                      <b className={styles.approvalPointer} onClick={() => onApproval(text)}>
                        审批
                      </b>
                    </>
                  )}
                </>
              );
            }}
          />
        </Table>
      </div>
      {visible && (
        <DetailDrawer
          onClose={onClose}
          visible={visible}
          visibleDetails={visibleDetails}
          details={details}
        />
      )}
      {visibleModal && (
        <ApprovalModal
          visibleModal={visibleModal}
          handleOk={handleOk}
          handleCancel={handleCancel}
          declineLoading={declineLoading}
          approvalLoading={approvalLoading}
          handleDecline={handleDecline}
          details={details}
          reason={reason}
          onReasonChange={onReasonChange}
          declineStatus={declineStatus}
        />
      )}
    </PageContainer>
  );
};

export default ApprovalAgency;
