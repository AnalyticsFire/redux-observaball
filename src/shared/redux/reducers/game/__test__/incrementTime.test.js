import { expect } from 'chai';
import incrementTimeFactory from '../incrementTime';
import makeState, { makeData } from './factories';

const gravitationalAcceleration = 0.1;

describe('incrementsTime', () => {
  context('when ball has not failed', () => {
    it('applies laws of motion', () => {
      const originalVelocity = 3;
      const data = makeData({
        velocity: originalVelocity,
        startedAt: Date.now() - 60000
      });
      const originalGameState = makeState(gravitationalAcceleration, { data });
      const incrementTime = incrementTimeFactory.create(gravitationalAcceleration);
      const newState = incrementTime(originalGameState);

      newState.data.forEach((ball) => {
        expect(ball.y).to.equal(originalVelocity);
        expect(ball.velocity).to.equal(3.1);
        expect(ball.acceleration).to.equal(0.1);
      });
      expect(newState.elapsed).to.be.greaterThan(60000);
      expect(newState.timeToFail).to.equal(null);
      expect(newState.strength).to.equal(1);

      expect(originalGameState).to.not.to.equal(newState);
    });

    it('it restores natural acceleration', () => {
      const originalVelocity = 3;
      const data = makeData({
        velocity: originalVelocity,
        startedAt: Date.now() - 60000,
        acceleration: 0.05
      });
      const originalGameState = makeState(gravitationalAcceleration, { data });
      const incrementTime = incrementTimeFactory.create(gravitationalAcceleration);
      const newState = incrementTime(originalGameState);

      newState.data.forEach((ball) => {
        expect(ball.acceleration).to.equal(0.1);
      });
      expect(newState.elapsed).to.be.greaterThan(60000);
      expect(originalGameState).to.not.to.equal(newState);
    });
  });

  context('when strength is diminished', () => {
    it('replenishes strength inverse to the elapsed amount of time (< 1 minute elapsed).', () => {
      const originalVelocity = 3;
      const data = makeData({
        velocity: originalVelocity
      });
      const originalGameState = makeState(gravitationalAcceleration, {
        data,
        strength: 0.5,
        startedAt: Date.now(),
        effectivelyStartedAt: Date.now()
      });
      const incrementTime = incrementTimeFactory.create(gravitationalAcceleration);
      const newState = incrementTime(originalGameState);

      newState.data.forEach((ball) => {
        expect(ball.y).to.equal(originalVelocity);
        expect(ball.velocity).to.equal(3.1);
        expect(ball.acceleration).to.equal(0.1);
      });
      expect(newState.elapsed).to.be.gte(0);
      expect(newState.timeToFail).to.equal(null);
      expect(newState.strength).to.equal(0.6);

      expect(originalGameState).to.not.to.equal(newState);
    });

    it('replenishes strength inverse to the elapsed amount of time (> 1 minute elapsed)', () => {
      const originalVelocity = 3;
      const data = makeData({
        velocity: originalVelocity
      });
      const originalGameState = makeState(gravitationalAcceleration, {
        data,
        strength: 0.5,
        startedAt: Date.now() - 121000,
        effectivelyStartedAt: Date.now() - 121000
      });
      const incrementTime = incrementTimeFactory.create(gravitationalAcceleration);
      const newState = incrementTime(originalGameState);

      newState.data.forEach((ball) => {
        expect(ball.y).to.equal(originalVelocity);
        expect(ball.velocity).to.equal(3.1);
        expect(ball.acceleration).to.equal(0.1);
      });
      expect(newState.elapsed).to.be.gte(121000);
      expect(newState.timeToFail).to.equal(null);
      // 0.5 + 0.1 * 60000 / 120000 = 0.55
      expect(newState.strength).to.be.lessThan(0.55);

      expect(originalGameState).to.not.to.equal(newState);
    });
  });

  context('when ball fails', () => {
    it('sets timeToFail', () => {
      const data = makeData({
        y: 499.9,
        velocity: 5
      });
      const originalGameState = makeState(gravitationalAcceleration, {
        data,
        totalHeight: 500,
        startedAt: Date.now() - 60000
      });
      const incrementTime = incrementTimeFactory.create(gravitationalAcceleration);
      const newState = incrementTime(originalGameState);

      expect(newState.elapsed).to.be.gte(60000);
      expect(newState.timeToFail).to.be.gte(60000);

      expect(originalGameState).to.not.equal(newState);
    });
  });
});
