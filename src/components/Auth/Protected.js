import React, { useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import io from 'socket.io-client';
import IdleJs from 'idle-js';

import LoadingScreen from '../helpers/LoadingScreen';
import useConfig from '../../util/hooks/useConfig';
import { UserInfoContext } from '../../context/UserInfoContext';
import UnregisteredUser from './UnregisteredUser';
import { SocketContext } from '../../context/SocketContext';
import { LoggedInUsersContext } from '../../context/LoggedinUsersContext';

function Protected({ children }) {
  const {
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    user,
    getAccessTokenSilently,
  } = useAuth0();
  const { data: config, isLoading: loadingConfig } = useConfig();
  const { setUserInfo, userInfo } = useContext(UserInfoContext);
  const { socket, setSocket } = useContext(SocketContext);
  const { setLoggedinUsers } = useContext(LoggedInUsersContext);

  const [userStatus, setUserStatus] = useState('active');

  const idle = new IdleJs({
    idle: 60000, // idle time in ms
    events: ['mousemove', 'keydown', 'mousedown', 'touchstart'], // events that will trigger the idle resetter
    onIdle: () => {
      setUserStatus('inactive');
    }, // callback function to be executed after idle time
    onActive: () => {
      setUserStatus('active');
    }, // callback function to be executed after back form idleness
    onHide: () => {
      setUserStatus('inactive');
    }, // callback function to be executed when window become hidden
    onShow: () => {
      setUserStatus('active');
    }, // callback function to be executed when window become visible
    keepTracking: true, // set it to false if you want to be notified only on the first idleness change
    startAtIdle: false, // set it to true if you want to start in the idle state
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (user && config) {
      const populateUserInfo = async () => {
        try {
          const accessToken = await getAccessTokenSilently();
          const { admins, agents } = config;
          const isAgent = agents.find((agent) => agent.email === user.email);
          const isAdmin = admins.find((admin) => admin.email === user.email);

          if (isAdmin) {
            setUserInfo({
              ...userInfo,
              name: isAdmin.name,
              role: 'ADMIN',
              email: user.email,
              accessToken,
            });
            const sock = io.connect(process.env.EASY_CRM_API_BASE, {
              query: `user=${JSON.stringify({
                email: user.email,
                name: isAdmin.name,
              })}`,
            });
            sock.on('userConnectionInfo', (data) => {
              setLoggedinUsers(data);
            });
            setSocket(sock);
          } else if (isAgent) {
            setUserInfo({
              ...userInfo,
              name: isAgent.name,
              role: 'AGENT',
              email: user.email,
              accessToken,
            });
            const sock = io.connect(process.env.EASY_CRM_API_BASE, {
              query: `user=${JSON.stringify({
                email: user.email,
                name: isAgent.name,
              })}`,
            });
            sock.on('userConnectionInfo', (data) => {
              setLoggedinUsers(data);
            });
            setSocket(sock);
          } else {
            setUserInfo({
              ...userInfo,
              role: 'UNKNOWN',
              email: user.email,
              accessToken,
            });
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Error while getting access token', e.message);
        }
      };
      populateUserInfo();
      idle.start();
    }

    return () => {
      if (socket) {
        socket.off('userConnectionInfo');
      }
      idle.reset();
    };
  }, [user, config]);

  useEffect(() => {
    if (socket) {
      socket.emit('status', { type: userStatus, email: userInfo.email });
    }
  }, [userStatus]);

  if (isLoading || loadingConfig) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* Loading while authentication in progress or access token is fetched */}
      {(!isLoading && !isAuthenticated) ||
      (isAuthenticated && !userInfo.accessToken) ? (
        <>
          <LoadingScreen />
        </>
      ) : null}

      {/* unknown user */}
      {isAuthenticated &&
      userInfo.accessToken &&
      userInfo.role === 'UNKNOWN' ? (
        <UnregisteredUser />
      ) : null}

      {/* legitmate user */}
      {isAuthenticated && userInfo.accessToken && userInfo.role !== 'UNKNOWN'
        ? children
        : null}
    </>
  );
}

export default Protected;
