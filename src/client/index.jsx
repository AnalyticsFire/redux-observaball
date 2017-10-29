import config from 'config';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import createStore from '../shared/redux';
import Layout from '../shared/layout';
import game from '../shared/lib/game';
import i18n from './lib/i18n';

if (config.get('api.fixtures')) {
  // eslint-disable-next-line global-require
  require('shared/api/fixtures');
}

const renderApp = (store) => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Layout i18n={i18n} />
      </BrowserRouter>
    </Provider>,
    document.getElementById('app')
  );
};

const store = createStore();
store.subscribe(() => {
  game.update(store.getState());
});
renderApp(store);
