import axios from 'axios';
import { useMutation } from 'react-query';

import { API_URLS } from '../constants';

const updateConfig = async (body) => {
  const { data } = await axios.patch(`${API_URLS.CONFIG}`, body);
  return data;
};

const useUpdateConfig = () => {
  return useMutation((config) => updateConfig(config));
};

export default useUpdateConfig;
