import { useQueryClient } from 'react-query';
import { getQueryStringFromObject } from '../stringUtils';
import useAccessToken from './useAccessToken';
import { getCustomers } from './useCustomers';

const usePrefetchCustomers = async (queryData) => {
  const queryString = getQueryStringFromObject(queryData);
  const queryClient = useQueryClient();
  const accessToken = useAccessToken();

  await queryClient.prefetchQuery(['customers', queryString], () =>
    getCustomers(queryString, accessToken)
  );
};

export default usePrefetchCustomers;
