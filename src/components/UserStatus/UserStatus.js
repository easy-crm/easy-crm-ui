import React, { useContext } from 'react';
import { Popover, Row } from 'antd';

import { DateTime } from 'luxon';
import { LoggedInUsersContext } from '../../context/LoggedinUsersContext';
import { UserInfoContext } from '../../context/UserInfoContext';

import onlineIcon from '../../icons/online.png';
import offlineIcon from '../../icons/offline.png';
import awayIcon from '../../icons/away.png';

import { DISPLAY_DATE_FORMAT } from '../../util/constants';

function UserStatus() {
  const { userInfo } = useContext(UserInfoContext);
  const { loggedinUsers = [] } = useContext(LoggedInUsersContext);
  const otherUsers = loggedinUsers.filter(
    ({ email }) => email !== userInfo.email
  );

  const formatDateTime = (input) => {
    if (input) {
      return DateTime.fromISO(input, {
        zone: 'utc',
      })
        .setZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
        .toFormat(`${DISPLAY_DATE_FORMAT} hh:mm a`);
    }
    return input;
  };
  return (
    <div style={{ color: 'white', height: '30vh', overflowY: 'auto' }}>
      <Row
        justify="center"
        style={{
          margin: '15px',
          borderBottom: 'solid 1px white',
          borderTop: 'solid 1px white',
        }}
      >
        USERS
      </Row>
      <Row justify="center">
        <br />
        {otherUsers.map((user) => (
          <div key={user.email}>
            {user.inactiveSince ? (
              <Popover
                title="Away"
                content={`since ${formatDateTime(user.inactiveSince)}`}
              >
                <img src={awayIcon} alt="away" height="15" />
                &nbsp;&nbsp;
                {user.name}
              </Popover>
            ) : (
              <Popover
                title={user.connections > 0 ? 'Online' : 'Offline'}
                content={
                  user.connections > 0
                    ? `since ${formatDateTime(user.onlineSince)}`
                    : `since ${formatDateTime(user.offlineSince)}`
                }
              >
                {user.connections > 0 ? (
                  <img src={onlineIcon} alt="online" height="15" />
                ) : (
                  <img src={offlineIcon} alt="offline" height="15" />
                )}
                &nbsp;
                {user.name}
              </Popover>
            )}
          </div>
        ))}
      </Row>
    </div>
  );
}

export default UserStatus;
