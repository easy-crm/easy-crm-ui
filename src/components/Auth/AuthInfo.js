import React, { useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Row, Space, Tooltip } from 'antd';
import { UserInfoContext } from '../../context/UserInfoContext';
import { getAvatarUrlFromName } from '../../util/stringUtils';

function AuthInfo() {
  const { isAuthenticated, user } = useAuth0();
  const {
    userInfo: { role, name },
  } = useContext(UserInfoContext);
  return (
    isAuthenticated && (
      <Tooltip
        title={
          <>
            <Row justify="center">{user.email}</Row>
            <Row justify="center">{role}</Row>
          </>
        }
      >
        <Space>
          <>
            <Avatar src={getAvatarUrlFromName(name)} size="large" />
            <span style={{ color: 'white' }}>Hello {name} &nbsp;</span>
          </>
        </Space>
      </Tooltip>
    )
  );
}

export default AuthInfo;
