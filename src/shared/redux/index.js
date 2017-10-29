import { createEpicMiddleware } from 'redux-observable';
import reduxReset from 'redux-reset';
import reduxCatch from 'redux-catch';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import epics from './epics';
import reducers from './reducers';
import storage from './middleware/localStorage';

const errorHandler = (error, _getState, _lastAction, _dispatch) => {
  console.error(error);
};

/**
 * createStore creates a Redux store with epics, storage, dev Tools (as necessary),
 * and error handling middleware.
 * @returns {object} A redux store.
 */
export default () => {
  const middleware = applyMiddleware(
    reduxCatch(errorHandler),
    createEpicMiddleware(epics),
    storage.save
  );

  let composeEnhancers = compose;
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-underscore-dangle
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  }
  const enhancers = composeEnhancers(middleware, reduxReset());

  return createStore(
    combineReducers(reducers),
    storage.load(),
    enhancers
  );
};
