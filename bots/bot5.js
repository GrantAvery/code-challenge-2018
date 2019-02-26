//  vs AdaptiveDefender: 
//  vs ZergRusher: 
//  vs HardHittingPacifist: 
//  vs Randomonium: 
//  vs TJBot: 
//  vs Bot2: 
//  vs Bot3: 
//  vs Bot4: 
//  vs Bot6: 

function createBot4() {

  let currentTurn = null;
  let totalTurns = null;
  let turnToLaunch = null;
  let lastOutcome = null;
  // let pastRoundsTheyAttackedAt = null;
  let currentRound = null;

  /**
   * OPTIONAL method / lifecycle hook.
   * Called by the framework to notify Player the start 
   * of the Match, providing the rules for the Match
   *
   * Parameters:
   *   matchRules - { rounds: <numberOfRoundsInMatch> }
   */
  function onMatchStart(matchRules) {
    // pastRoundsTheyAttackedAt = [rounds];
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

    turnToLaunch = getRandomInt((totalTurns / 2) - 1, totalTurns)
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

    // let sum = 0;
    // for( let i = 0; i < pastRoundsTheyAttackedAt.length; i++ ){
    //   sum += parseInt( pastRoundsTheyAttackedAt[i], 10 );
    // }
    // let avgRoundTheyAttackedAt = sum/pastRoundsTheyAttackedAt.length;

    if(currentTurn == 0) {
      soldiersToCreate = (productionCapacity / 2);
      producersToCreate = productionCapacity - soldiersToCreate;
    }
    else if (lastOutcome == 'LOSE') {
      soldiersToCreate = (productionCapacity / 2);
      producersToCreate = productionCapacity - soldiersToCreate;
      turnToLaunch--;
      lastOutcome = '';
    }
    else if ((turnToLaunch !== currentTurn) && (currentTurn < totalTurns)) {
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
    lastOutcome = roundResult.outcome;
    
    // if (roundResult.them.attackLaunched)
    // {
    //   pastRoundsTheyAttackedAt[currentRound] = turnsPlayed;
    // }

    currentRound++;
  }

  /* Return our Player object */
  return {
    meta: {
      name: 'Grant Bot4',
      author: 'Grant Avery, grantavery@icloud.com'
    },
    onMatchStart,
    onRoundStart,
    playTurn,
    onRoundEnd
  };
};

function player() {
  return createBot4();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default player;
