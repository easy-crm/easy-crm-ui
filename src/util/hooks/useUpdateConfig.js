import axios from 'axios';
import { useMutation } from 'react-query';

import { API_URLS } from '../constants';
import useAccessToken from './useAccessToken';

const updateConfig = async (body, accessToken) => {
  const requestConfig = { headers: { Authorization: `Bearer ${accessToken}` } };

  const { data } = await axios.patch(`${API_URLS.CONFIG}`, body, requestConfig);
  return data;
};

const useUpdateConfig = () => {
  const accessToken = useAccessToken();
  return useMutation((config) => updateConfig(config, accessToken));
};

export default useUpdateConfig;
