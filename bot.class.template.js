class ExamplePlayer {

  /**
   * Constructor. Will always be called by the framework with no arguments!
   */
  constructor() {
    this.meta = {
      name: 'Name of Your Bot',
      author: 'Your Name'
    };
  }

  /**
   * OPTIONAL method / lifecycle hook.
   * Called by the framework to notify Player the start of the Match, providing the rules for the Match
   *
   * Parameters:
   *   matchRules - { rounds: <numberOfRoundsInMatch> }
   */
  onMatchStart(matchRules) { };

  /**
   * OPTIONAL method / lifecycle hook.
   * Called by the framework to notify Player of the start of a Round, providing the rules for the Round
   *
   * Parameters:
   *   roundRules - {
   *     turns: <maxNumberOfTurnsInRound>,
   *     defenderBonus: <amountOfBonusAttackPowerWhenDefending>
   *   }
   */
  onRoundStart(roundRules) { };

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
    return {
      newProducers: 0,
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
   *       attackLaunched: <true | false -- true if you launched attack on last turn>
   *     },
   *     them: {
   *       producers: <theirProducerCountAtEndOfRound>,
   *       soldiers: <theirSoldierCountAtEndOfRound>,
   *       attackLaunched: <true | false -- true if they launched attack on last turn>
   *     }
   *   }
   */
  onRoundEnd(roundResult) { };

}

function getPlayer() {
  return new ExamplePlayer();
}

export default getPlayer;
