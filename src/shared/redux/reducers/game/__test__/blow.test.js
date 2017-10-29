import { expect } from 'chai';
import blow from '../blow';
import makeState from './factories';

const fullUserForce = 2;

describe('blow', () => {
  context('full strength', () => {
    it('decrements strenth and acceleration', () => {
      const originalGameState = makeState();
      const newState = blow(originalGameState, { lane: 3 });
      expect(originalGameState.strength - 0.2).to.equal(newState.strength);
      const originalBall = originalGameState.data[3];
      const newBall = newState.data[3];
      const da = (fullUserForce * originalGameState.strength) / originalBall.mass;
      expect(newBall.acceleration).to.equal(originalBall.acceleration - da);
      expect(originalGameState).to.not.to.equal(newState);
      expect(originalBall).to.not.equal(newBall);
    });
  });

  context('empty strength', () => {
    it('does not decrement strength below 0 and acceleration does not change', () => {
      const originalGameState = makeState(0.1, { strength: 0.1 });
      const newState = blow(originalGameState, { lane: 3 });
      expect(newState.strength).to.equal(0);
      const originalBall = originalGameState.data[3];
      const newBall = newState.data[3];
      const da = (fullUserForce * originalGameState.strength) / originalBall.mass;
      expect(newBall.acceleration).to.equal(originalBall.acceleration - da);
      expect(originalGameState).to.not.to.equal(newState);
      expect(originalBall).to.not.equal(newBall);
    });
  });
});
