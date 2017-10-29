import React, { Component } from 'react';
import times from 'lodash/times';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Scoreboard from './Scoreboard';
import a from '../../redux/actions';
import game from '../../lib/game';
import styles from './home.scss';

class Home extends Component {

  componentDidMount() {
    game.initialize();
    this.props.reset();
  }

  render() {
    const { blow } = this.props;
    return (
      <div id="Home">
        <h1>Redux Observaball</h1>
        <p>
          Welcome to Redux-Observaball. It is a simple game created with React, d3, and
          redux-observable. The rules are simple.
        </p>
        <ul>
          <li>{'The balls\' mass is proportional to its area - ie larger balls weigh more.'}</li>
          <li>All balls are subject to equal constant acceleration.</li>
          <li>Press the buttons to apply an upward force on a ball.</li>
          <li>
            As you apply upward force, you lose strength and the force applied diminishes
            proportional to the strength meter to the right.
          </li>
          <li>
            The points earned are proportional to the mass of each ball *times* the time before the
            first ball falls off the board.
          </li>
          <li>As time goes on, you replenish your strength less quickly!</li>
        </ul>
        <div className={styles.gameContainer} id="game_container">
          <div>
            <svg id="board" />
            <div className={styles.buttonRow}>
              {
                times(10, i => i).map(i => (
                  <button onClick={() => blow(i)} key={i}>{i + 1}</button>
                ))
              }
            </div>
          </div>
          <div>
            <h3>Strength Level</h3>
            <svg id="energy_meter" />
          </div>
          <Scoreboard />
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  blow: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired
};

const mapStateToProps = _state => ({});
const mapDispatchToProps = dispatch => ({
  blow: i => dispatch(a.user.blow.click(i)),
  reset: () => dispatch(a.game.reset())
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
