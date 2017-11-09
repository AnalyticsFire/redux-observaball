const isGameOngoing = ({ game }) => game.startedAt !== null && game.pausedAt === null;

const shouldGameEnd = ({ game }) => game.timeToFail !== null && !game.ended;

export default {
  isGameOngoing,
  shouldGameEnd
};
