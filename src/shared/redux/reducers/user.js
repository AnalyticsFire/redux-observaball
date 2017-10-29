// @flow
import { createReducer } from 'redux-act';
import a from '../actions';

const defaults = {
  strength: 1.0
};

export default createReducer({
  [a.user.blow]: state => ({
    ...state,
    strength: Math.max(0, state.strength - 0.2)
  }),
  [a.game.incrementTime]: state => ({
    ...state,
    strength: Math.min(1.0, state.strength + 0.1)
  }),
  [a.game.reset]: () => defaults
}, defaults);
