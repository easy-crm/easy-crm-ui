import React, { useContext, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import LoadingScreen from '../helpers/LoadingScreen';
import useConfig from '../../util/hooks/useConfig';
import { UserInfoContext } from '../../context/UserInfoContext';
import UnregisteredUser from './UnregisteredUser';

function Protected({ children }) {
  const { isLoading, isAuthenticated, loginWithRedirect, user } = useAuth0();
  const { data: config, isLoading: loadingConfig } = useConfig();
  const { setUserInfo, userInfo } = useContext(UserInfoContext);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated]);

  useEffect(() => {
    if (user) {
      const { admins, agents } = config;
      const isAgent = agents.find((agent) => agent.email === user.email);
      const isAdmin = admins.find((admin) => admin.email === user.email);
      if (isAdmin) {
        setUserInfo({ ...userInfo, name: isAdmin.name, role: 'ADMIN' });
      } else if (isAgent) {
        setUserInfo({ ...userInfo, name: isAgent.name, role: 'AGENT' });
      }
    }
  }, [user]);

  if (isLoading || loadingConfig) {
    return <LoadingScreen />;
  }

  return (
    <>
      {!isLoading && !isAuthenticated ? <LoadingScreen /> : null}
      {isAuthenticated && !userInfo.role ? <UnregisteredUser /> : null}
      {isAuthenticated && userInfo.role ? children : null}
    </>
  );
}

export default Protected;
