import { expect } from 'chai';
import { ActionsObservable } from 'redux-observable';
import { TestScheduler } from 'rxjs';
import a from '../../actions';
import { incrementTime } from '../';

describe('incrementTime epic', () => {
  context('timeToFail not already set', () => {
    it('emits nothing', () => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).to.deep.equal(expected);
      });

      const action$ = new ActionsObservable(
        testScheduler.createHotObservable('a|', {
          a: a.game.incrementTime()
        })
      );
      const store = {
        getState: () => ({
          game: { timeToFail: null, ended: false }
        })
      };
      const test$ = incrementTime(action$, store);
      testScheduler.expectObservable(test$).toBe('-|', {});
      testScheduler.flush();
    });
  });

  context('game state already ended', () => {
    it('emits nothing', () => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).to.deep.equal(expected);
      });

      const action$ = new ActionsObservable(
        testScheduler.createHotObservable('a|', {
          a: a.game.incrementTime()
        })
      );
      const store = {
        getState: () => ({
          game: { timeToFail: 30000, ended: true }
        })
      };
      const test$ = incrementTime(action$, store);
      testScheduler.expectObservable(test$).toBe('-|', {});
      testScheduler.flush();
    });
  });

  context('timeToFail is set and game not ended', () => {
    it('emits game.end', () => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).to.deep.equal(expected);
      });

      const action$ = new ActionsObservable(
        testScheduler.createHotObservable('a|', {
          a: a.game.incrementTime()
        })
      );
      const store = {
        getState: () => ({
          game: { timeToFail: 30000, ended: false }
        })
      };
      const test$ = incrementTime(action$, store);
      testScheduler.expectObservable(test$).toBe('a|', {
        a: a.game.end()
      });
      testScheduler.flush();
    });
  });
});
