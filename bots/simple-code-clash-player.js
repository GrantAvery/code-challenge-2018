import { PlayerActions } from '../game/simple-code-clash.js';

class SimpleCodeClashPlayer {

  constructor() {
    this.onMatchStart();
  };

  onMatchStart() {
    this.onRoundStart();
  };

  onRoundStart() {
    this.turnNumber = 0;
  };

  playTurn() {
    this.turnNumber++;
    if (this.turnNumber == 1) {
      return PlayerActions.BUILD_DEFENSE;
    } else {
      return PlayerActions.TRAIN_ATTACKER;
    }
  }

  onRoundEnd() {
  };

}

export { SimpleCodeClashPlayer };
