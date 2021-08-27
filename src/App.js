import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { Layout } from 'antd';
import NavMenu from './components/NavMenu/NavMenu';
import NavBar from './components/NavBar/NavBar';
import SideBar from './components/SideBar/SideBar';
import registerAxiosErrorInterceptor from './util/axiosUtil';
import Customer from './components/Customer/Customer';

// this will handle 401, 403, 500 errors globally for all axios http calls
registerAxiosErrorInterceptor();

document.addEventListener(
  'contextmenu',
  (e) => {
    if (process.env.REACT_APP_MODE !== 'dev') {
      e.preventDefault();
    }
  },
  false
);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <NavBar theme="dark" menu={<NavMenu />} />
          <Layout>
            <SideBar theme="dark" menu={<NavMenu />} />
            <Layout.Content className="content">
              <Switch>
                <Route exact path="/">
                  <Redirect to="/customers" />
                </Route>
                <Route path="/customers">
                  <Customer />
                </Route>
                <Route path="/agents">Agents</Route>
                <Route path="/admins">Admins</Route>
                <Route path="/platforms">Platforms</Route>
                <Route path="/labels">Labels</Route>
              </Switch>
            </Layout.Content>
          </Layout>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
