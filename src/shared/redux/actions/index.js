import { createAction } from 'redux-act';

const start = createAction('Start the game.');
start.click = createAction('User clicks to start game');
const pause = createAction('Pause the game.');
const reset = createAction('Reset the game.');
const end = createAction('User has lost game - programmatically end it.');
const incrementTime = createAction('Increment time in the game.');
const applyForce = createAction('Apply force on ball.');
applyForce.click = createAction('User clicked on applyForce button.');

export default {
  start,
  pause,
  reset,
  end,
  incrementTime,
  applyForce
};
