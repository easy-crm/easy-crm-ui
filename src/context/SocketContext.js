import { createContext, useState } from 'react';

const SocketContext = createContext(null);

const { Provider } = SocketContext;

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  return <Provider value={{ socket, setSocket }}>{children}</Provider>;
};

export { SocketProvider, SocketContext };
