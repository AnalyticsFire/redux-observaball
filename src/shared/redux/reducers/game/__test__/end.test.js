import { expect } from 'chai';
import end from '../end';
import makeState from './factories';

describe('end', () => {
  it('adds game to history', () => {
    const originalGameState = makeState();
    const newState = end(originalGameState);
    expect(newState.history.length).to.equal(1);
    expect(newState.history[0].startedAt).to.equal(originalGameState.startedAt);
    expect(newState.history[0].points).to.equal(originalGameState.points);
    expect(newState.history[0].elapsed).to.equal(originalGameState.elapsed);
    expect(originalGameState).to.not.to.equal(newState);
  });
});
