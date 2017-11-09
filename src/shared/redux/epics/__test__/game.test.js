import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';
import { ActionsObservable } from 'redux-observable';
import { TestScheduler, Observable } from 'rxjs';
import a from '../../actions';
import { game } from '../';

describe('game epic', () => {
  context('game is ongoing and not paused', () => {
    const store = {
      getState: () => ({
        game: { startedAt: moment().subtract(10000, 'seconds'), pausedAt: null, elapsed: 250 }
      })
    };

    it('emits nothing', () => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).to.deep.equal(expected);
      });

      const action$ = new ActionsObservable(
        testScheduler.createHotObservable('a|', {
          a: a.start({ paused: false })
        })
      );

      const test$ = game(action$, store);
      testScheduler.expectObservable(test$).toBe('-|', {});
      testScheduler.flush();
    });
  });

  context('game waiting to be started', () => {
    afterEach(() => {
      Observable.interval.restore();
    });

    const testExpectedBehavior = (actionName, store) => {
      it(`emits an interval that is stopped with ${actionName}`, () => {
        const testScheduler = new TestScheduler((actual, expected) => {
          expect(actual).to.deep.equal(expected);
        });

        const interval$ = testScheduler.createColdObservable('--a--b--c', {
          a: 0,
          b: 1,
          c: 2
        });
        sinon.stub(Observable, 'interval').returns(interval$);

        const action$ = new ActionsObservable(
          testScheduler.createHotObservable('a-----b', {
            a: a.start.click(),
            b: a[actionName]()
          })
        );
        const test$ = game(action$, store);
        testScheduler.expectObservable(test$).toBe('a-b--b', {
          a: a.start(),
          b: a.incrementTime()
        });
        testScheduler.flush();
      });
    };

    context('game started, but paused', () => {
      const store = {
        getState: () => ({
          game: {
            startedAt: Date.now(),
            elapsed: 10,
            pausedAt: Date.now(),
            timeToFail: null,
            ended: false
          }
        })
      };
      testExpectedBehavior('pause', store);
      testExpectedBehavior('reset', store);
      testExpectedBehavior('end', store);
    });

    context('game has not yet started', () => {
      const store = {
        getState: () => ({
          game: {
            startedAt: null,
            elapsed: 0,
            pausedAt: null,
            timeToFail: null,
            ended: false
          }
        })
      };

      testExpectedBehavior('pause', store);
      testExpectedBehavior('reset', store);
      testExpectedBehavior('end', store);
    });
  });

  context('user has lost', () => {
    afterEach(() => {
      Observable.interval.restore();
    });

    it('emits end action after time incremented', () => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).to.deep.equal(expected);
      });

      const interval$ = testScheduler.createColdObservable('--a--b', {
        a: 0,
        b: 1
      });
      sinon.stub(Observable, 'interval').returns(interval$);

      const action$ = new ActionsObservable(
        // this also tests throttling
        testScheduler.createHotObservable('aa', {
          a: a.start.click()
        })
      );

      const store = {
        getState: () => ({})
      };
      const getState = sinon.stub(store, 'getState');
      const now = moment();
      [
        // first call, game not yet started, will start the interval.
        { startedAt: null, pausedAt: null, timeToFail: null, ended: false, elapsed: 0 },
        // the second call to a.start() will be filtered out b/c game already started.
        { startedAt: now.subtract(60, 'seconds'), pausedAt: null, timeToFail: null, ended: false, elapsed: 10 },
        // the third call, the interval will incrementTime and filter will see game should not end.
        { startedAt: now.subtract(60, 'seconds'), pausedAt: null, timeToFail: null, ended: false, elapsed: 250 },
        // the fourth call, the interval will incrementTime and filter will see game should end.
        { startedAt: now.subtract(60, 'seconds'), pausedAt: null, timeToFail: now.subtract(10, 'seconds'), ended: false, elapsed: 250 }
      ].forEach((gameState, i) => getState.onCall(i).returns({ game: gameState }));

      const test$ = game(action$, store);
      testScheduler.expectObservable(test$).toBe('a-b--(bc)', {
        a: a.start(),
        b: a.incrementTime(),
        c: a.end()
      });
      testScheduler.flush();
    });
  });
});
