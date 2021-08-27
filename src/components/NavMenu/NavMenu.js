import React from 'react';
import { Menu } from 'antd';
import {
  AppstoreAddOutlined,
  CustomerServiceOutlined,
  SketchOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';

const NavMenu = () => {
  const location = useLocation();
  const activeLink = location.pathname.replace('/', '').split('/')[0];

  const menuLinks = [
    {
      path: '/customers',
      key: 'customers',
      icon: <TeamOutlined />,
      title: 'Customers',
    },
    {
      path: '/agents',
      key: 'agents',
      icon: <CustomerServiceOutlined />,
      title: 'Agents',
    },
    {
      path: '/admins',
      key: 'admins',
      icon: <SketchOutlined />,
      title: 'Admins',
    },
    {
      path: '/platforms',
      key: 'platforms',
      icon: <AppstoreAddOutlined />,
      title: 'Platforms',
    },
    {
      path: '/labels',
      key: 'labels',
      icon: <TagsOutlined />,
      title: 'Labels',
    },
  ];

  return (
    <Menu theme="dark" selectedKeys={[activeLink]} mode="inline">
      {menuLinks.map(({ path, key, title, icon }) => (
        <Menu.Item key={key}>
          {icon}
          <span>{title}</span>
          <Link to={path} />
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default NavMenu;
