import axios from 'axios';
import { useQuery } from 'react-query';
import { getQueryStringFromObject } from '../stringUtils';

import { API_URLS } from '../constants';

const getCustomers = async (queryString) => {
  const { data } = await axios.get(`${API_URLS.CUSTOMER}?${queryString}`);
  return data;
};

const useCustomers = (queryData) => {
  const queryString = getQueryStringFromObject(queryData);
  return useQuery(['customers', queryString], () => getCustomers(queryString));
};

export default useCustomers;
