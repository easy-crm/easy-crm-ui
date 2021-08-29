import { LoginOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../../logo.png';

function UnregistereUser() {
  const { logout } = useAuth0();
  return (
    <Result
      status="403"
      title={
        <>
          <img src={logo} height="100" alt="logo" />
        </>
      }
      subTitle={
        <h2>
          You are not registered as Agent or Admin! Please ask the administrator
          to register you in the system!
        </h2>
      }
      extra={
        <>
          <Button size="large" type="primary" onClick={logout}>
            <LoginOutlined /> Logout
          </Button>
        </>
      }
    />
  );
}

export default UnregistereUser;
