import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import jsdom from 'jsdom';
import sinon from 'sinon';
import { createStore } from 'redux';
import Home from '../';
import { makeDefault } from '../../../redux/reducers/game';

describe('Home compnent', () => {
  beforeEach(() => {
    const dom = new jsdom.JSDOM();
    global.window = dom.window;
    global.document = window.document;
  });
  afterEach(() => {
    delete global.window;
    delete global.document;
  });

  it('renders without breaking', () => {
    const state = {
      game: makeDefault()
    };
    const store = createStore(() => (state), state);
    sinon.spy(Home.prototype, 'componentDidMount');
    const page = mount(
      <Provider store={store}>
        <Home />
      </Provider>
    );
    expect(page.find('#game_container')).to.have.length(1);
    expect(page.find('#strength_meter')).to.have.length(1);
  });
});
