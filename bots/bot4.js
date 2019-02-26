// Bad vs AdaptiveDefender: 463 to 537, 0 draws
// Good vs ZergRusher: 1000 to 0, 0 draws
// Good vs HardHittingPacifist: 776 to 224, 0 draws
// Good vs Randomonium: 795 to 205, 0 draws
// Good vs TJBot: 780 to 220, 0 draws
// Bad vs Bot2: 378 to 549, 73 draws
// Good vs Bot3: 571 to 344, 85 draws
//  vs Bot5: 
//  vs Bot6: 

/**
 * GrantBot.js
 * Copyright Grant Avery.
 * 
 * This bot's strategy first counteracts bots similar 
 * to zerg rush and ones that tend to attack at the 
 * same spot, and then once those are out of the way 
 * it will check if the rng (between half the turns and 
 * the total) matches the current round, and if so it 
 * attacks. It also never waits till the last round, 
 * in case another bot had a strategy involving that.
 * Until attacking time, it collects 1/3 soldiers while
 * stockpiling producers for the time of attack.
 */
function createBot4() {

  let currentTurn = null;
  let totalTurns = null;
  let turnToLaunch = null;
  let lastOutcome = null;
  let lastObservedAttack = null;

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
    lastObservedAttack = roundResult.them.launchedAttack ? roundResult.turnsPlayed : null;
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
