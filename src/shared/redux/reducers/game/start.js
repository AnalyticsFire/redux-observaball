export default (state) => {
  const now = Date.now();
  if (state.pausedAt) {
    const elapsedSincePaused = now - state.pausedAt;
    return {
      ...state,
      effectivelyStartedAt: state.effectivelyStartedAt + elapsedSincePaused,
      pausedAt: null
    };
  }
  return {
    ...state,
    startedAt: now,
    effectivelyStartedAt: now,
    pausedAt: null,
    elapsed: 0
  };
};
