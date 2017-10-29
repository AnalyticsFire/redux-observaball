import { expect } from 'chai';
import sinon from 'sinon';
import { ActionsObservable } from 'redux-observable';
import { TestScheduler, Observable } from 'rxjs';
import a from '../../actions';
import { start } from '../';

describe('start epic', () => {
  context('game is ongoing and not paused', () => {
    it('emits nothing', () => {
      const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).to.deep.equal(expected);
      });

      const store = {
        getState: () => ({
          game: { elapsed: 1000 }
        })
      };

      const action$ = new ActionsObservable(
        testScheduler.createHotObservable('a|', {
          a: a.game.start({ paused: false })
        })
      );

      const test$ = start(action$, store);
      testScheduler.expectObservable(test$).toBe('-|', {});
      testScheduler.flush();
    });
  });

  context('game is ongoing and paused', () => {
    afterEach(() => {
      Observable.interval.restore();
    });
    const behavior = (actionName) => {
      it(`emits an interval that is stopped with ${actionName}`, () => {
        const testScheduler = new TestScheduler((actual, expected) => {
          expect(actual).to.deep.equal(expected);
        });

        const store = {
          getState: () => ({
            game: { elapsed: 1000 }
          })
        };

        const interval$ = testScheduler.createColdObservable('--a--a--a', {
          a: 1
        });
        sinon.stub(Observable, 'interval').returns(interval$);

        const action$ = new ActionsObservable(
          testScheduler.createHotObservable('a-----b', {
            a: a.game.start({ paused: true }),
            b: a.game[actionName]()
          })
        );
        const test$ = start(action$, store);
        testScheduler.expectObservable(test$).toBe('--a--a', {
          a: a.game.incrementTime()
        });
        testScheduler.flush();
      });
    };
    behavior('pause');
    behavior('reset');
    behavior('end');
  });

  context('game has not yet started', () => {
    afterEach(() => {
      Observable.interval.restore();
    });
    const behavior = (actionName) => {
      it(`emits an interval that is stopped with ${actionName}`, () => {
        const testScheduler = new TestScheduler((actual, expected) => {
          expect(actual).to.deep.equal(expected);
        });

        const store = {
          getState: () => ({
            game: { elapsed: 0 }
          })
        };

        const interval$ = testScheduler.createColdObservable('--a--a--a', {
          a: 1
        });
        sinon.stub(Observable, 'interval').returns(interval$);

        const action$ = new ActionsObservable(
          testScheduler.createHotObservable('a-----b', {
            a: a.game.start({ paused: false }),
            b: a.game[actionName]()
          })
        );
        const test$ = start(action$, store);
        testScheduler.expectObservable(test$).toBe('--a--a', {
          a: a.game.incrementTime()
        });
        testScheduler.flush();
      });
    };
    behavior('pause');
    behavior('reset');
    behavior('end');
  });
});
