const { REACT_APP_EASY_CRM_API_BASE } = process.env;

const API_URLS = {
  CUSTOMER: `${REACT_APP_EASY_CRM_API_BASE}/customer`,
  CONFIG: `${REACT_APP_EASY_CRM_API_BASE}/config`,
};

const DISPLAY_DATE_FORMAT = 'LLL dd, yyyy';
export { API_URLS, DISPLAY_DATE_FORMAT };
