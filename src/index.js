/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import ReactDOM from 'react-dom';

import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import { getConfig } from './config';
import history from './util/history';
import NetworkStatus from './components/helpers/NetworkStatus';

import './index.css';

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  ...(config.audience ? { audience: config.audience } : null),
  redirectUri: window.location.origin,
  scope: config.scope,
  onRedirectCallback,
  useRefreshTokens: true,
};

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider {...providerConfig}>
      <NetworkStatus />
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
