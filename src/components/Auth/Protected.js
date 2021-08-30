import React, { useContext, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import LoadingScreen from '../helpers/LoadingScreen';
import useConfig from '../../util/hooks/useConfig';
import { UserInfoContext } from '../../context/UserInfoContext';
import UnregisteredUser from './UnregisteredUser';

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
          } else if (isAgent) {
            setUserInfo({
              ...userInfo,
              name: isAgent.name,
              role: 'AGENT',
              email: user.email,
              accessToken,
            });
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
    }
  }, [user, config]);

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
