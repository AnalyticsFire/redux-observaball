import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import durationToString from '../../lib/durationToString';
import styles from './home.scss';
import a from '../../redux/actions';
import s from '../../redux/selectors';
import types from '../../types';

const Control = ({ points, elapsed, start, pause, reset, started, paused, gameHistories }) => (
  <div className={styles.controlContainer}>
    <h3>Scoreboard</h3>
    <h2>{points}</h2>
    <h4>{elapsed}</h4>
    <div className={styles.controls}>
      <button onClick={() => start()} disabled={started && !paused}>Start</button>
      <button onClick={pause} disabled={!started || paused}>Pause</button>
      <button onClick={reset} disabled={!started}>Reset</button>
    </div>
    <h2>Top 5 Scores</h2>
    <table>
      <thead>
        <tr>
          <th>Started At</th>
          <th>Points</th>
          <th>Elapsed Time</th>
        </tr>
      </thead>
      <tbody>
        {gameHistories.map(game => (
          <tr key={game.startedAt}>
            <td>{moment(game.startedAt).format('YYYY-MM-DD HH:mm')}</td>
            <td>{Math.round(game.points).toLocaleString()}</td>
            <td>{durationToString(game.elapsed)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

Control.propTypes = {
  start: PropTypes.func.isRequired,
  pause: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  elapsed: PropTypes.string.isRequired,
  started: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  points: PropTypes.string.isRequired,
  gameHistories: types.GameHistories.isRequired
};

const mapStateToProps = state => ({
  elapsed: durationToString(state.game.elapsed),
  started: s.isGameOngoing(state),
  paused: state.game.pausedAt !== null,
  points: Math.round(state.game.points).toLocaleString(),
  gameHistories: state.game.history
});
const mapDispatchToProps = dispatch => ({
  start: () => dispatch(a.start.click()),
  pause: () => dispatch(a.pause()),
  reset: () => dispatch(a.reset()),
  applyForce: i => dispatch(a.applyForce.click(i))
});

export default connect(mapStateToProps, mapDispatchToProps)(Control);
