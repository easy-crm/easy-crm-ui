import axios from 'axios';
import { useMutation } from 'react-query';

import { API_URLS } from '../constants';
import useAccessToken from './useAccessToken';

const createCustomer = async (body, accessToken) => {
  const requestConfig = { headers: { Authorization: `Bearer ${accessToken}` } };

  const { data } = await axios.post(
    `${API_URLS.CUSTOMER}`,
    body,
    requestConfig
  );
  return data;
};

const useCreateCustomer = () => {
  const accessToken = useAccessToken();
  return useMutation((customerInfo) =>
    createCustomer(customerInfo, accessToken)
  );
};

export default useCreateCustomer;
