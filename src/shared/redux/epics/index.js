// @flow
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { combineEpics } from 'redux-observable';
import a from '../actions';
import s from '../selectors';

export const applyForce = (action$, store) =>
  action$.ofType(a.applyForce.click.getType())
    .throttleTime(100)
    .filter(_action => s.isGameOngoing(store.getState()))
    .map(action => a.applyForce({ lane: action.payload }));

export const game = (action$, store) =>
  action$.ofType(a.start.click.getType())
    .filter(_action => !s.isGameOngoing(store.getState()))
    .mergeMap(() => {
      const start = Observable.of(a.start());
      const interval = Observable.interval(250)
        .takeUntil(action$.ofType(
          a.pause.getType(),
          a.reset.getType(),
          a.end.getType()
        ));
      const incrementTime = interval
        .map(_interval => a.incrementTime());
      const end = interval
        .filter(_action => s.shouldGameEnd(store.getState()))
        .map(_action => a.end());
      return Observable.merge(start, incrementTime, end);
    });

export default combineEpics(
  applyForce,
  game,
);
