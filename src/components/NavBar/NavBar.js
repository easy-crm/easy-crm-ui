import React, { useState } from 'react';
import { Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import './NavBar.css';
import { Link } from 'react-router-dom';
import logo from '../../logo.png';

const NavBar = ({ menu }) => {
  const [visible, setVisible] = useState(false);
  return (
    <nav className="navbar">
      <MenuOutlined className="menu" onClick={() => setVisible(true)} />

      <Drawer
        title={
          <Link to="/">
            <img src={logo} className="logo-drawer" alt="logo" />
          </Link>
        }
        placement="left"
        onClick={() => setVisible(false)}
        onClose={() => setVisible(false)}
        visible={visible}
      >
        {menu}
      </Drawer>
      <Link to="/">
        <img src={logo} className="logo" alt="logo" />
      </Link>
    </nav>
  );
};
export default NavBar;
