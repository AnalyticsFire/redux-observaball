import strengthMeter from './strengthMeter';
import board from './board';

const initialize = () => {
  board.initialize();
  strengthMeter.initialize();
};

const update = (state) => {
  strengthMeter.setLevel(state.game.strength);
  board.update(state.game.data);
};

export default {
  initialize,
  update
};

