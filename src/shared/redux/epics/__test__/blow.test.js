import { expect } from 'chai';
import { ActionsObservable } from 'redux-observable';
import { TestScheduler } from 'rxjs';
import a from '../../actions';
import { blow } from '../';

describe('blow epic', () => {
  it('returns token and user attributes', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).to.deep.equal(expected);
    });

    const action$ = new ActionsObservable(
      testScheduler.createHotObservable('a|', {
        a: a.user.blow.click(2)
      })
    );

    const test$ = blow(action$, undefined);
    testScheduler.expectObservable(test$).toBe('a|', {
      a: a.user.blow({ lane: 2 })
    });
    testScheduler.flush();
  });
});
