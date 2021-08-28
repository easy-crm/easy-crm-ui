import axios from 'axios';
import { useMutation } from 'react-query';

import { API_URLS } from '../constants';

const deleteCustomer = async (_id) => {
  const { data } = await axios.delete(`${API_URLS.CUSTOMER}/${_id}`);
  return data;
};

const useDeleteCustomer = () => {
  return useMutation((_id) => deleteCustomer(_id));
};

export default useDeleteCustomer;
