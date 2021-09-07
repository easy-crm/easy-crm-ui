import { message } from 'antd';
import React, { useEffect, useState } from 'react';

function NetworkStatus() {
  const [status, setStatus] = useState(null);

  const handleOnline = () => {
    setStatus('ONLINE');
  };
  const handleOffline = () => {
    setStatus('OFFLINE');
  };

  window.addEventListener('offline', handleOffline);
  window.addEventListener('online', handleOnline);

  useEffect(() => {
    if (status === 'ONLINE') {
      message.success('Connected back to internet.');
    } else if (status === 'OFFLINE') {
      message.error(
        'Your network is unavailable. Check your data or wifi connection!'
      );
    }
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [status]);
  return <></>;
}

export default NetworkStatus;
