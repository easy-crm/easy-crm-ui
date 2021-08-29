import { useContext } from 'react';
import { UserInfoContext } from '../../context/UserInfoContext';

const useAccessToken = () => {
  const {
    userInfo: { accessToken },
  } = useContext(UserInfoContext);
  return accessToken;
};

export default useAccessToken;
