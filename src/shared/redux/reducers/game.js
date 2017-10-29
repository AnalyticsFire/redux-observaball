// @flow
import { createReducer } from 'redux-act';
import times from 'lodash/times';
import orderBy from 'lodash/orderBy';
import random from 'lodash/random';
import a from '../actions';

const gravitationalAcceleration = 0.1;
const fullUserForce = 2;
const makeDefault = (history = []) => ({
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

const getStrengthReplenishment = elapsed => 0.1 * Math.max(1, (60000 / elapsed));

export default createReducer({
  [a.user.blow]: (state, { lane, strength }) => {
    const ball = { ...state.data[lane] };
    const force = fullUserForce * strength;
    ball.acceleration -= (force / ball.mass);
    return {
      ...state,
      strength: Math.max(0, state.strength - 0.2),
      data: [
        ...state.data.slice(0, lane),
        ball,
        ...state.data.slice(lane + 1)
      ]
    };
  },
  [a.game.incrementTime]: (state) => {
    const now = Date.now();
    let timeToFail = null;
    const data = state.data.map((ball) => {
      if (ball.y + ball.velocity >= state.totalHeight) {
        timeToFail = now - state.effectivelyStartedAt;
      }
      return {
        ...ball,
        y: Math.max(0, ball.y + ball.velocity),
        velocity: ball.velocity + ball.acceleration,
        acceleration: gravitationalAcceleration
      };
    });
    const elapsed = now - state.effectivelyStartedAt;
    return {
      ...state,
      data,
      elapsed,
      points: data.reduce((sum, ball) =>
        sum + (ball.mass * (elapsed / 1000))
      , 0),
      timeToFail,
      strength: Math.min(1.0, state.strength + getStrengthReplenishment(elapsed))
    };
  },
  [a.game.start]: (state) => {
    const now = Date.now();
    if (state.pausedAt) {
      const elapsedSincePaused = now - state.pausedAt;
      return {
        ...state,
        effectivelyStartedAt: state.effectivelyStartedAt + elapsedSincePaused,
        pausedAt: null
      };
    }
    return {
      ...state,
      startedAt: now,
      effectivelyStartedAt: now,
      pausedAt: null,
      elapsed: 0
    };
  },
  [a.game.reset]: state => makeDefault(state.history),
  [a.game.pause]: state => ({
    ...state,
    pausedAt: Date.now()
  }),
  [a.game.end]: (state) => {
    const lastGame = {
      startedAt: state.startedAt,
      points: state.points,
      elapsed: state.elapsed
    };
    const history = orderBy([
      ...state.history,
      lastGame
    ].slice(0, 5), ['points'], ['desc']);
    return {
      ...state,
      history,
      ended: true
    };
  }
}, makeDefault());
