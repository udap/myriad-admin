import { Space } from 'antd';
import React from 'react';
import { useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.container;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.container}  ${styles.dark}`;
  }
  return (
    <Space className={className}>
      <div className={styles.headerLeft}>上海千缦网络科技有限公司</div>
      <div className={styles.headerRight}>
        <Avatar />
        <SelectLang className={styles.action} />
      </div>
    </Space>
  );
};
export default GlobalHeaderRight;
