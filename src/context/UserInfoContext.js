import { createContext, useState } from 'react';

const UserInfoContext = createContext({ name: '', role: '' });

const { Provider } = UserInfoContext;

const UserInfoProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState({ name: '', role: '' });
  return <Provider value={{ userInfo, setUserInfo }}>{children}</Provider>;
};

export { UserInfoProvider, UserInfoContext };
