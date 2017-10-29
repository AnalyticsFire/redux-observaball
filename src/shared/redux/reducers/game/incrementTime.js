const getStrengthReplenishment = elapsed => 0.1 * Math.min(1, (60000 / elapsed));

const create = gravitationalAcceleration => (state) => {
  const now = Date.now();
  let timeToFail = null;
  const data = state.data.map((ball) => {
    if (ball.y + ball.velocity >= state.totalHeight) {
      timeToFail = now - state.effectivelyStartedAt;
    }
    return {
      ...ball,
      y: Math.max(0, ball.y + ball.velocity),
      velocity: ball.velocity + ball.acceleration,
      acceleration: gravitationalAcceleration
    };
  });
  const elapsed = now - state.effectivelyStartedAt;
  return {
    ...state,
    data,
    elapsed,
    points: data.reduce((sum, ball) =>
      sum + (ball.mass * (elapsed / 1000))
    , 0),
    timeToFail,
    strength: Math.min(1.0, state.strength + getStrengthReplenishment(elapsed))
  };
};

export default {
  create
};
