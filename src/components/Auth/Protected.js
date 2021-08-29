import React, { useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import LoadingScreen from '../helpers/LoadingScreen';
import useConfig from '../../util/hooks/useConfig';
import { UserRoleContext } from '../../context/UserRoleContext';
// import UnregistereUser from './UnregistereUser';

function Protected({ children }) {
  const { isLoading, isAuthenticated, loginWithRedirect, user } = useAuth0();
  const { data: config, isLoading: loadingConfig } = useConfig();
  const { setUserRole } = useContext(UserRoleContext);
  if (!isLoading && !isAuthenticated) {
    loginWithRedirect();
    return null;
  }

  if (isLoading || loadingConfig) {
    return <LoadingScreen />;
  }

  if (user) {
    const { admins, agents } = config;
    const isAgent = agents.some((agent) => agent.email === user.email);
    const isAdmin = admins.some((admin) => admin.email === user.email);
    if (isAdmin) {
      setUserRole('ADMIN');
    } else if (isAgent) {
      setUserRole('AGENT');
    } else {
      // return <UnregistereUser />;
    }
  }

  return <>{children}</>;
}

export default Protected;
