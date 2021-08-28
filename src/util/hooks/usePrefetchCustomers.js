import { useQueryClient } from 'react-query';
import { getQueryStringFromObject } from '../stringUtils';
import { getCustomers } from './useCustomers';

const usePrefetchCustomers = async (queryData) => {
  const queryString = getQueryStringFromObject(queryData);
  const queryClient = useQueryClient();
  await queryClient.prefetchQuery(['customers', queryString], () =>
    getCustomers(queryString)
  );
};

export default usePrefetchCustomers;
