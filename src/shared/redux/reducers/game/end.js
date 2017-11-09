import orderBy from 'lodash/orderBy';

export default (state) => {
  const lastGame = {
    startedAt: state.startedAt,
    points: state.points,
    elapsed: state.elapsed
  };
  const history = orderBy([
    ...state.history,
    lastGame
  ], ['points'], ['desc']).slice(0, 5);

  return {
    ...state,
    history,
    ended: true
  };
};
