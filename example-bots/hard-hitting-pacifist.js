/**
 * The strategy employed by this bot is to focus solely on growing the number of
 * producers until the last turn, and then creating as many soldiers as possible.
 * 
 * This strategy will beat anyone who never launches an attack, and who
 * produces soldiers less efficiently prior to the last turn in the round.
 */
class HardHittingPacifist {

  constructor() {
    meta = {
      name: 'Hard Hitting Pacifist (Example Bot)',
      author: 'Bravo LT'
    };
  }

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
