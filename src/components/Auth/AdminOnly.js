import { useContext } from 'react';
import { UserRoleContext } from '../../context/UserRoleContext';

function AdminOnly({ children }) {
  const { userRole } = useContext(UserRoleContext);
  if (userRole === 'ADMIN') {
    return children;
  }
  return null;
}

export default AdminOnly;
