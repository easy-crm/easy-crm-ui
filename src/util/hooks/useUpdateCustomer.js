import axios from 'axios';
import { useMutation } from 'react-query';

import { API_URLS } from '../constants';

const updateCustomer = async (body) => {
  const { data } = await axios.patch(`${API_URLS.CUSTOMER}/${body._id}`, body);
  return data;
};

const useUpdateCustomer = () => {
  return useMutation((customerInfo) => updateCustomer(customerInfo));
};

export default useUpdateCustomer;
