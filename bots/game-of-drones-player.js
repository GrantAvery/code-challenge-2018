import { PlayerActions } from '../game/game-of-drones.js';

class GameOfDronesPlayer {

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
    if (this.turnNumber === 1) {
      return PlayerActions.BUILD_WORKER;
    } else {
      return PlayerActions.TRAIN_ATTACKER;
    }
  }

  onRoundEnd() {
  };

}

export { GameOfDronesPlayer };
