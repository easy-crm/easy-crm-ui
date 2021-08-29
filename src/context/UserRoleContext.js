import { createContext, useState } from 'react';

const UserRoleContext = createContext(null);

const { Provider } = UserRoleContext;

const UserRoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  return <Provider value={{ userRole, setUserRole }}>{children}</Provider>;
};

export { UserRoleProvider, UserRoleContext };
