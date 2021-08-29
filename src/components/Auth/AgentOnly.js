import { useContext } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext';

function AgentOnly({ children }) {
  const { userRole } = useContext(UserRoleContext);
  if (userRole === 'AGENT') {
    return children;
  }
  return null;
}

export default AgentOnly;
