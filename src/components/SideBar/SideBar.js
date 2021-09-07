import React from 'react';
import { Layout } from 'antd';
import './SideBar.css';

import UserStatus from '../UserStatus/UserStatus';

const SideBar = ({ menu }) => {
  return (
    <Layout.Sider
      className="sidebar"
      breakpoint="lg"
      theme="dark"
      collapsedWidth={0}
      trigger={null}
    >
      {menu}
      <UserStatus />
    </Layout.Sider>
  );
};
export default SideBar;
