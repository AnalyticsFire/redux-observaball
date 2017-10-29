import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import createStore from '../shared/redux';
import Layout from '../shared/layout';
import game from '../shared/lib/game';

const renderApp = (store) => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <Layout />
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
