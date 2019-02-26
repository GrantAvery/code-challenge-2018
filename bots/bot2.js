// Bad vs AdaptiveDefender: 1 to 999, 0 draws
// Good vs ZergRusher: 1000 to 0, 0 draws
// Good vs HardHittingPacifist: 1000 to 0, 0 draws
// Good vs Randomonium: 780 to 220, 0 draws
// Good vs TJBot: 809 to 191, 0 draws
// Good vs Bot3: 676 to 155, 169 draws
// Good vs Bot4: 549 to 378, 62 draws
//  vs Bot5: 
//  vs Bot6: 

function createBot2() {

  let currentTurn = null;
  let totalTurns = null;
  let roundResults = null;

  /**
   * OPTIONAL method / lifecycle hook.
   * Called by the framework to notify Player the start 
   * of the Match, providing the rules for the Match
   *
   * Parameters:
   *   matchRules - { rounds: <numberOfRoundsInMatch> }
   */
  function onMatchStart(matchRules) {

  }

  /**
   * OPTIONAL method / lifecycle hook.
   * Called by the framework to notify Player of the 
   * start of a Round, providing the rules for the Round
   *
   * Parameters:
   *   roundRules - {
   *     turns: <maxNumberOfTurnsInRound>,
   *     defenderBonus: 
   * <amountOfBonusAttackPowerWhenDefending>
   *   }
   */
  function onRoundStart(roundRules) {
    currentTurn = 0;
    totalTurns = roundRules.turns;
  }

  /**
   * REQUIRED method!
   * Called by the framework to solicit the Player's 
   * actions each turn, providing the Player's current 
   * state.
   * This is the only mechanism by which the Player is 
   * able to communicate with the Game.
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
   *     launchAttack: <true | false -- set to true to 
   *      launch attack with your soldiers at end of turn>
   *   }
   */
  function playTurn(playerState) {
    let productionCapacity = playerState.producers;
    let soldiersToCreate = null;
    let producersToCreate = null;
    let launchOrNot = null;

    if(currentTurn == 0) {
      soldiersToCreate = (productionCapacity / 2);
      producersToCreate = productionCapacity - soldiersToCreate;
    }
    else if(currentTurn <= (totalTurns / 2)) {
      soldiersToCreate = (productionCapacity / 3);
      producersToCreate = productionCapacity - soldiersToCreate;
    }
    else {
      soldiersToCreate = productionCapacity;
      producersToCreate = 0;
      launchOrNot = true;
    }

    currentTurn++;

    return {
      newProducers: producersToCreate,
      newSoldiers: soldiersToCreate,
      launchAttack: launchOrNot
    }
  }

  /**
   * OPTIONAL method.
   * Called by the framework to notify Player of the 
   * end of a Round, providing the results of the round.
   *
   * Parameters:
   *   roundResult - {
   *     outcome: <'WIN' | 'LOSS' | 'DRAW'>,
   *     turnsPlayed: <numberOfTurnsPlayedInRound>,
   *     you: {
   *       producers: <yourProducerCountAtEndOfRound>,
   *       soldiers: <yourSoldierCountAtEndOfRound>,
   *       attackLaunched: <true | false -- true if 
   *        you launched attack on last turn>
   *     },
   *     them: {
   *       producers: <theirProducerCountAtEndOfRound>,
   *       soldiers: <theirSoldierCountAtEndOfRound>,
   *       attackLaunched: <true | false -- true if 
   *        they launched attack on last turn>
   *     }
   *   }
   */
  function onRoundEnd(roundResult) {
  }

  /* Return our Player object */
  return {
    meta: {
      name: 'Grant Bot2',
      author: 'Grant Avery, grantavery@icloud.com'
    },
    onMatchStart,
    onRoundStart,
    playTurn,
    onRoundEnd
  };
};

function player() {
  return createBot2();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default player;
