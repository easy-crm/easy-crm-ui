import axios from 'axios';
import { useMutation } from 'react-query';

import { API_URLS } from '../constants';
import useAccessToken from './useAccessToken';

const updateCustomer = async (body, accessToken) => {
  const requestConfig = { headers: { Authorization: `Bearer ${accessToken}` } };

  const { data } = await axios.patch(
    `${API_URLS.CUSTOMER}/${body._id}`,
    body,
    requestConfig
  );
  return data;
};

const useUpdateCustomer = () => {
  const accessToken = useAccessToken();
  return useMutation((customerInfo) =>
    updateCustomer(customerInfo, accessToken)
  );
};

export default useUpdateCustomer;
