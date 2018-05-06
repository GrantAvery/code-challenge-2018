/**
 * The strategy employed by this bot is to create as many producers as possible 
 * until the last moment, and then create as many soldiers as possible. In other
 * words, it is the optimal build for the scenario where an "in the field" clash
 * is forced by the game after the last turn in the round.
 * 
 * This strategy will beat anyone who never launches an attack, and who
 * produces soldiers less efficiently prior to the last turn in the round.
 */
class HardHittingPacifist {

  onRoundStart(roundRules) {
    this.turnsInThisRound = roundRules.turns;
    this.currentTurn = 0;
  };

  playTurn(playerState) {
    this.currentTurn++;

    if (this.turnsInThisRound > this.currentTurn) {
      return {
        newProducers: playerState.producers
      };
    } else {
      return {
        newSoldiers: playerState.producers,
      };
    }
  }
}

function player() {
  return new HardHittingPacifist();
}

export default player;
