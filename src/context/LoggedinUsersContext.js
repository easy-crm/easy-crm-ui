import { createContext, useState } from 'react';

const LoggedInUsersContext = createContext([]);

const { Provider } = LoggedInUsersContext;

const LoggedInUsersProvider = ({ children }) => {
  const [loggedinUsers, setLoggedinUsers] = useState([]);
  return (
    <Provider value={{ loggedinUsers, setLoggedinUsers }}>{children}</Provider>
  );
};

export { LoggedInUsersProvider, LoggedInUsersContext };
