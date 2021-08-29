import React, { useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Row, Space, Tooltip } from 'antd';
import { UserRoleContext } from '../../context/UserRoleContext';

function AuthInfo() {
  const { isAuthenticated, user } = useAuth0();
  const { userRole } = useContext(UserRoleContext);
  return (
    isAuthenticated && (
      <Tooltip
        title={
          <>
            <Row justify="center">{user.email}</Row>
            <Row justify="center">{userRole}</Row>
          </>
        }
      >
        <Space>
          <>
            <Avatar src={user.picture} size="large" />
            <span style={{ color: 'white' }}>
              Hello {user.name.split(' ')[0]} &nbsp;
            </span>
          </>
        </Space>
      </Tooltip>
    )
  );
}

export default AuthInfo;
