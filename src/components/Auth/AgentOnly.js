import { useContext } from 'react';
import { UserInfoContext } from '../../context/UserInfoContext';

function AgentOnly({ children }) {
  const {
    userInfo: { role },
  } = useContext(UserInfoContext);
  if (role === 'AGENT') {
    return children;
  }
  return null;
}

export default AgentOnly;
