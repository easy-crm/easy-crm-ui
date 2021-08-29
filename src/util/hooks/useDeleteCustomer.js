import axios from 'axios';
import { useMutation } from 'react-query';

import { API_URLS } from '../constants';
import useAccessToken from './useAccessToken';

const deleteCustomer = async (_id, accessToken) => {
  const requestConfig = { headers: { Authorization: `Bearer ${accessToken}` } };

  const { data } = await axios.delete(
    `${API_URLS.CUSTOMER}/${_id}`,
    requestConfig
  );
  return data;
};

const useDeleteCustomer = () => {
  const accessToken = useAccessToken();
  return useMutation((_id) => deleteCustomer(_id, accessToken));
};

export default useDeleteCustomer;
