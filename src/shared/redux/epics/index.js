// @flow
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { combineEpics } from 'redux-observable';
import a from '../actions';

const blow = (action$, store) =>
  action$.ofType(a.user.blow.click.getType())
    .throttleTime(100)
    .map((action) => {
      const strength = store.getState().user.strength;
      return a.user.blow({ lane: action.payload, strength });
    });

const start = (action$, store) =>
  action$.ofType(a.game.start.getType())
    .filter((action) => {
      const state = store.getState();
      return state.game.elapsed === 0 || action.payload.paused;
    })
    .mergeMap(() =>
      Observable
        .interval(250)
        .map(() => a.game.incrementTime())
        .takeUntil(action$.ofType(
          a.game.pause.getType(),
          a.game.reset.getType(),
          a.game.end.getType()
        ))
    );

const incrementTime = (action$, store) =>
    action$.ofType(a.game.incrementTime.getType())
      .filter(() => {
        const state = store.getState();
        return state.game.timeToFail !== null && !state.game.ended;
      })
      .map(() => a.game.end());

export default combineEpics(
  blow,
  start,
  incrementTime
);
