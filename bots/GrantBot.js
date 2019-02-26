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
function createGrantBot() {

  let currentTurn = null;
  let totalTurns = null;
  let turnToLaunch = null;
  let lastOutcome = null;

  function onRoundStart(roundRules) {
    currentTurn = 0;
    totalTurns = roundRules.turns;

    turnToLaunch = getRandomInt((totalTurns / 2) - 1, totalTurns)
  }

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

  function onRoundEnd(roundResult) {
    lastOutcome = roundResult.outcome;
  }

  return {
    meta: {
      name: 'GrantBot',
      author: 'Grant Avery, grant.m.avery@gmail.com'
    },
    onRoundStart,
    playTurn,
    onRoundEnd
  };
};

function player() {
  return createGrantBot();
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default player;
