const fullUserForce = 2;

export default (state, { lane }) => {
  const ball = { ...state.data[lane] };
  const force = fullUserForce * state.strength;
  ball.acceleration -= (force / ball.mass);
  return {
    ...state,
    strength: Math.max(0, state.strength - 0.2),
    data: [
      ...state.data.slice(0, lane),
      ball,
      ...state.data.slice(lane + 1)
    ]
  };
};
