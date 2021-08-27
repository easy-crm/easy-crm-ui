import axios from 'axios';
import { useQuery } from 'react-query';

import { API_URLS } from '../constants';

const getConfig = async () => {
  const { data } = await axios.get(`${API_URLS.CONFIG}`);
  return data;
};

const useConfig = () => {
  return useQuery(['config'], getConfig);
};

export default useConfig;
