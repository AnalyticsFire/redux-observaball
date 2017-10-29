import PropTypes from 'prop-types';

const GameHistory = PropTypes.shape({
  startedAt: PropTypes.number.isRequired,
  points: PropTypes.number.isRequired,
  elapsed: PropTypes.number.isRequired
});

const GameHistories = PropTypes.arrayOf(GameHistory);

export default {
  GameHistory,
  GameHistories
};
