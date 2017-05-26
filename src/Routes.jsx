import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Route, Router, IndexRedirect, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import AuthService from './utils/AuthService';
import NotFound from './components/NotFound';
import NotAuthorized from './components/NotAuthorized';
import Layout from './Layout';
import GoogleMap from './components/GoogleMap';
import configureStore from './components/redux/configureStore';

const auth = new AuthService(process.env.AUTH0_CLIENT_ID, process.env.AUTH0_DOMAIN);

const requireAuth = (nextState, replace) => {
  if (!AuthService.loggedIn()) {
    replace({ pathname: '/placeholder' });
  }
};

export const makeMainRoutes = () =>
  (
    <Provider store={configureStore(auth)}>
      <Router history={browserHistory}>
        <Route path="/" component={Layout} auth={auth}>
          <IndexRedirect to="/map" />
          <Route path="placeholder" component={NotAuthorized} />
          <Route path="map" component={GoogleMap} onEnter={requireAuth} />
          <Route path="*" component={NotFound} />
        </Route>
      </Router>
    </Provider>
  );

makeMainRoutes.propTypes = { store: T.object.isRequired };

export default makeMainRoutes;
