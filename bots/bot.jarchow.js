class DrozenPlayer {


  constructor() {
    this.meta = {
      name: 'Drozen',
      author: 'Matt Jarchow'
    };
  }

  onMatchStart(matchRules) {
    this.roundsInMatch = matchRules.rounds;
    this.currentRound = 0;
    this.totalAttacks = 0
    this.totalAttackTurns = 0;
    this.totalEnemySoldiers = 0;
    this.avgAttackTurn = 100;
  };

  onRoundStart(roundRules) {
    this.turnsInRound = roundRules.turns;
    this.defenderBonus = roundRules.defenderBonus;
    this.currentTurn = 0;
    this.currentRound++;
  };

  /**
   * REQUIRED method!
   * Called by the framework to solicit the Player's actions each turn, providing the Player's current state.
   * This is the only mechanism by which the Player is able to communicate with the Game.
   *
   * Parameters:
   *   playerState - {
   *     producers: <currentProducerCount>,
   *     soldiers: <currentSoldierCount>
   *   }
   *
   * Expected Return Value: PlayerActions
   *   {
   *     newProducers: <numberOfNewProducersToProduce>,
   *     newSoldiers: <numberOfNewSoldiersToProduce>,
   *     launchAttack: <true | false -- set to true to launch attack with your soldiers at end of turn>
   *   }
   */
  playTurn(playerState) {
    this.currentTurn++;
  
    if (this.turnsInRound == this.currentTurn) {
      return {
        newSoldiers: playerState.producers
      }
    };

    if (this.currentTurn + 1 >= this.avgAttackTurn) {
      if (this.currentTurn < 3) {
        return {
          newSoldiers: playerState.producers
        }
      }

      return {
        newSoldiers: playerState.producers,
        launchAttack: true
      }
    };

    return {
      newProducers: playerState.producers,
      newSoldiers: 0,
      launchAttack: false
    };
  }

  /**
   * OPTIONAL method.
   * Called by the framework to notify Player of the end of a Round, providing the results of the round.
   *
   * Parameters:
   *   roundResult - {
   *     outcome: <'WIN' | 'LOSS' | 'DRAW'>,
   *     turnsPlayed: <numberOfTurnsPlayedInRound>,
   *     you: {
   *       producers: <yourProducerCountAtEndOfRound>,
   *       soldiers: <yourSoldierCountAtEndOfRound>,
   *       launchedAttack: <true | false -- true if you launched attack on last turn>
   *     },
   *     them: {
   *       producers: <theirProducerCountAtEndOfRound>,
   *       soldiers: <theirSoldierCountAtEndOfRound>,
   *       launchedAttack: <true | false -- true if they launched attack on last turn>
   *     }
   *   }
   */
  onRoundEnd(roundResult) {
    this.totalEnemySoldiers += roundResult.them.soldiers;
    if ( roundResult.them.launchedAttack ) {
      this.totalAttacks++;
      this.totalAttackTurns += roundResult.turnsPlayed;
      this.avgAttackTurn = this.totalAttackTurns / this.totalAttacks;
    }

    if (this.totalAttacks == 0) {
        if (roundResult.outcome == "WIN") {
            this.avgAttackTurn = roundResult.turnsPlayed;
        } else {
            this.avgAttackTurn = this.turnsInRound;
        }
    }
}

}

function getPlayer() {
  return new DrozenPlayer();
}

export default getPlayer;
