import { createStore, compose, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { persistStore } from 'redux-persist';
import { loadingBarMiddleware } from 'react-redux-loading-bar';

function configureStoreProd(initialState) {

  const middlewares = [
    thunk, // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    loadingBarMiddleware({ promiseTypeSuffixes: ['BEGIN_AJAX_CALL', 'SUCCESS', 'AJAX_CALL_ERROR'] })
  ];

  const store = createStore(rootReducer, initialState, compose(
    applyMiddleware(...middlewares)
  ));

  persistStore(store);
  return store;
}

function configureStoreDev(initialState) {

  const middlewares = [
    reduxImmutableStateInvariant(), // Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
    thunk, // https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
    loadingBarMiddleware({ promiseTypeSuffixes: ['BEGIN_AJAX_CALL', 'SUCCESS', 'AJAX_CALL_ERROR'] }),
    logger
  ];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
  const store = createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware(...middlewares)//, autoRehydrate() // this causes issues in IE when initialState is also supplied at index.js
  ));

  if (module.hot) {
    module.hot.accept('../reducers', () => { // Enable Webpack hot module replacement for reducers
      const nextReducer = require('../reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  persistStore(store);
  return store;
}

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export default configureStore;
