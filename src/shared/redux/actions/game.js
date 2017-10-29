import { createAction } from 'redux-act';

const start = createAction('Start the game.');
const pause = createAction('Pause the game.');
const reset = createAction('Reset the game.');
const end = createAction('Game ended.');
const incrementTime = createAction('Increment time in the game.');

export default {
  start,
  pause,
  reset,
  end,
  incrementTime
};
