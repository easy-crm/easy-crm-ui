import { useContext } from 'react';
import { UserInfoContext } from '../../context/UserInfoContext';

function AdminOnly({ children }) {
  const {
    userInfo: { role },
  } = useContext(UserInfoContext);
  if (role === 'ADMIN') {
    return children;
  }
  return null;
}

export default AdminOnly;
