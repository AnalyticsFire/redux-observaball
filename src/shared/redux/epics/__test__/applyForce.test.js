import { expect } from 'chai';
import { ActionsObservable } from 'redux-observable';
import { TestScheduler, Observable } from 'rxjs';

import sinon from 'sinon';
import a from '../../actions';
import { applyForce } from '../';

describe('applyForce epic', () => {
  afterEach(() => {
    Observable.prototype.throttleTime.restore();
  });

  it('throttles and emits apply force if game ongoing', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).to.deep.equal(expected);
    });

    const action$ = new ActionsObservable(
      testScheduler.createHotObservable('aaab', {
        a: a.applyForce.click(2),
        b: a.applyForce.click(3)
      })
    );

    const throttle$ = testScheduler.createColdObservable('---a', {
      a: a.applyForce.click(3)
    });
    sinon.stub(Observable.prototype, 'throttleTime').returns(throttle$);

    const store = {
      getState: () => ({
        game: {
          startedAt: Date.now(),
          elapsed: 10,
          pausedAt: null,
          timeToFail: null,
          ended: false
        }
      })
    };

    const test$ = applyForce(action$, store);
    testScheduler.expectObservable(test$).toBe('---a', {
      a: a.applyForce({ lane: 3 })
    });
    testScheduler.flush();
  });

  it('does not emit applyForce when game not ongoing', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).to.deep.equal(expected);
    });

    const action$ = new ActionsObservable(
      testScheduler.createHotObservable('aaab', {
        a: a.applyForce.click(2),
        b: a.applyForce.click(3)
      })
    );

    const interval$ = testScheduler.createColdObservable('---a', {
      a: a.applyForce.click(3)
    });
    sinon.stub(Observable.prototype, 'throttleTime').returns(interval$);

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

    const test$ = applyForce(action$, store);
    testScheduler.expectObservable(test$).toBe('', {});
    testScheduler.flush();
  });
});
