import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import AuthService from '../../utils/AuthService';
import mapReducer from './reducers/map';
import loginReducer from './reducers/login';

/**
* configureStore is responsible for creatig the state structure, applying any middleware and
* creating the redux store.
*/
const configureStore = () => {
  const rootReducer = combineReducers({
    mapState: mapReducer,
    authorized: loginReducer,
  });

  const middleware = [thunk];
  if (process.env.NODE_ENV === 'development') {
    middleware.push(logger);
  }
  return createStore(
    rootReducer,
    { authorized: AuthService.loggedIn() },
    applyMiddleware(...middleware));
};

export default configureStore;
