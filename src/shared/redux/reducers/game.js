// @flow
import { createReducer } from 'redux-act';
import times from 'lodash/times';
import random from 'lodash/random';
import blow from './game/blow';
import start from './game/start';
import incrementTime from './game/incrementTime';
import end from './game/end';
import a from '../actions';

const gravitationalAcceleration = 0.1;

export const makeDefault = (history = []) => ({
  data: times(10, i => ({
    lane: i,
    mass: random(0.4, 1),
    y: 0,
    acceleration: gravitationalAcceleration,
    velocity: 0
  })),
  startedAt: null,
  effectivelyStartedAt: null,
  pausedAt: null,
  totalHeight: 500,
  points: 0,
  elapsed: 0,
  strength: 1,
  timeToFail: null,
  ended: false,
  history
});

export default createReducer({
  [a.user.blow]: blow,
  [a.game.incrementTime]: incrementTime.create(gravitationalAcceleration),
  [a.game.start]: start,
  [a.game.reset]: state => makeDefault(state.history),
  [a.game.pause]: state => ({
    ...state,
    pausedAt: Date.now()
  }),
  [a.game.end]: end
}, makeDefault());
