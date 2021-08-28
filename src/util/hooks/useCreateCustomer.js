import axios from 'axios';
import { useMutation } from 'react-query';

import { API_URLS } from '../constants';

const createCustomer = async (body) => {
  const { data } = await axios.post(`${API_URLS.CUSTOMER}`, body);
  return data;
};

const useCreateCustomer = () => {
  return useMutation((customerInfo) => createCustomer(customerInfo));
};

export default useCreateCustomer;
