import times from 'lodash/times';
import random from 'lodash/random';


export const makeData = (opts = {}) =>
  times(10, i => ({
    lane: i,
    mass: random(0.4, 1),
    y: 0,
    acceleration: 0.1,
    velocity: 0,
    ...opts
  }));

export default (acceleration = 0.1, opts = {}) => ({
  data: makeData({ acceleration }),
  startedAt: null,
  effectivelyStartedAt: null,
  pausedAt: null,
  totalHeight: 500,
  points: 0,
  elapsed: 0,
  strength: 1,
  timeToFail: null,
  ended: false,
  history: [],
  ...opts
});
