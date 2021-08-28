import axios from 'axios';
import { notification } from 'antd';

const registerAxiosErrorInterceptor = () => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          // TODO redirect to login
        }
        if (status === 403) {
          notification.error({
            duration: 0,
            message: 'Access Denied!',
            description: data.message
              ? data.message
              : 'You are not allowed to perform this action',
          });
        }
        if (status === 500) {
          notification.error({
            duration: 0,
            message: 'Something went wrong!',
            description: data.message
              ? data.message
              : 'Application server returned unexpected error!',
          });
        }
        if (status === 404) {
          notification.error({
            duration: 0,
            message: 'Something went wrong!',
            description: data.message
              ? data.message
              : "Resource you tried to fetch or modify doesn't exist!",
          });
        }
        if (status === 400) {
          notification.error({
            duration: 0,
            message: 'Client Error!',
            description: data.message
              ? data.message
              : "Resource you tried to fetch or modify doesn't exist!",
          });
        }
      }
      return Promise.reject(error);
    }
  );
};

export default registerAxiosErrorInterceptor;
