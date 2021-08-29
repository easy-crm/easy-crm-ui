import axios from 'axios';
import { useQuery } from 'react-query';
import { getQueryStringFromObject } from '../stringUtils';

import { API_URLS } from '../constants';
import useAccessToken from './useAccessToken';

const getCustomers = async (queryString, accessToken) => {
  const requestConfig = { headers: { Authorization: `Bearer ${accessToken}` } };

  const { data } = await axios.get(
    `${API_URLS.CUSTOMER}?${queryString}`,
    requestConfig
  );
  return data;
};

const useCustomers = (queryData) => {
  const accessToken = useAccessToken();
  const queryString = getQueryStringFromObject(queryData);
  return useQuery(['customers', queryString], () =>
    getCustomers(queryString, accessToken)
  );
};

export default useCustomers;
export { getCustomers };
