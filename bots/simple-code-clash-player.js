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
      return 'BUILD_DEFENSE';
    } else {
      return 'TRAIN_ATTACKER';
    }
  }

  onRoundEnd() {
  };

}
