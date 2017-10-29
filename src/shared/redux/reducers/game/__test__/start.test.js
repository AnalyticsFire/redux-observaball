import { expect } from 'chai';
import start from '../start';
import makeState from './factories';

const gravitationalAcceleration = 0.1;

const permittedRuntimeDelta = 2000;

describe('start', () => {
  context('game not paused', () => {
    it('sets startedAt and elapsed = 0', () => {
      const originalGameState = makeState();
      const newState = start(originalGameState);
      expect(newState.elapsed).to.equal(0);
      const now = Date.now();
      expect(newState.startedAt).to.be.gt(now - permittedRuntimeDelta);
      expect(newState.startedAt).to.be.lte(now);
      expect(newState.effectivelyStartedAt).to.equal(newState.startedAt);
      expect(newState.pausedAt).to.be.equal(null);
      expect(originalGameState).to.not.equal(newState);
    });
  });

  context('game paused', () => {
    it('sets effectivelyStartedAt', () => {
      const now = Date.now();
      const originalGameState = makeState(gravitationalAcceleration, {
        startedAt: now - 120000,
        effectivelyStartedAt: now - 120000,
        pausedAt: now - 60000,
        elapsed: 60000
      });
      const newState = start(originalGameState);
      expect(newState.elapsed).to.equal(60000);
      expect(newState.startedAt).to.equal(now - 120000);
      expect(newState.effectivelyStartedAt).to.be.above(now - 60000 - permittedRuntimeDelta);
      expect(newState.effectivelyStartedAt).to.be.lte(now - (60000 - 1));
      expect(newState.pausedAt).to.be.equal(null);
      expect(originalGameState).to.not.equal(newState);
    });
  });
});
