import React, { useState } from 'react';
import { Col, Drawer, Row } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import './NavBar.css';
import { Link } from 'react-router-dom';
import logo from '../../logo.png';
import AuthInfo from '../Auth/AuthInfo';
import Logout from '../Auth/Logout';

const NavBar = ({ menu }) => {
  const [visible, setVisible] = useState(false);
  return (
    <nav className="navbar">
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
        <AuthInfo />
        {menu}
      </Drawer>
      <Row>
        <Col xs={2} md={0}>
          <MenuOutlined className="menu" onClick={() => setVisible(true)} />
        </Col>
        <Col xs={10} md={12}>
          <Link to="/">
            <img src={logo} className="logo" alt="logo" />
          </Link>
        </Col>
        <Col xs={12} style={{ textAlign: 'right' }}>
          <span className="hidden-xs">
            <AuthInfo />
          </span>
          <Logout />
        </Col>
      </Row>
    </nav>
  );
};
export default NavBar;
