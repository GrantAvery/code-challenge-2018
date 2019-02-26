function createChanceBot() {

  let currentTurn = null;
  let turnToBuildSoldiersOn = null;
  let lastObservedAttack = null;
  let totalTurns = null;
  let roundResults = null;
  let pickStrategy = null;

  function onRoundStart(roundRules) {
    pickStrategy = getRandomInt(1, 5);

    //case 1 rules
    currentTurn = 0;
    turnToBuildSoldiersOn = lastObservedAttack || roundRules.turns;

    //case 2 rules
    this.currentTurn = 0;
    this.turnToAttack = getRandomInt(1, roundRules.turns + 1); // turns + 1 to enable never attacking

    //case 3 rules
    this.roundRules = roundRules;

    //case 4 rules
    this.turnsInThisRound = roundRules.turns;
    this.currentTurn = 0;
  }

  function playTurn(playerState) {
    let productionCapacity = playerState.producers;
    let soldiersToCreate = null;
    let producersToCreate = null;
    productionCapacity = playerState.producers;

    currentTurn++;

    if (pickStrategy == 1)
    {
      return (currentTurn >= turnToBuildSoldiersOn)
      ? { newSoldiers: productionCapacity }
      : { newProducers: productionCapacity };
    }
    else if (pickStrategy == 2)
    {
      productionCapacity = playerState.producers;
      soldiersToCreate = getRandomInt(0, productionCapacity);
      producersToCreate = productionCapacity - soldiersToCreate;
    
      return {
        newProducers: producersToCreate,
        newSoldiers: soldiersToCreate,
        launchAttack: (this.currentTurn >= this.turnToAttack)
      };
    }    
    else if (pickStrategy == 3)
    {
      let minimumSoldiersNeededToWin = this.roundRules.defenderBonus + 1;
      soldiersToCreate = playerState.producers;
      let totalSoldiersAtEndOfThisRound = playerState.soldiers + soldiersToCreate;
      let isWinFeasible = totalSoldiersAtEndOfThisRound >= minimumSoldiersNeededToWin;
  
      return {
        newProducers: 0,
        newSoldiers: soldiersToCreate,
        launchAttack: isWinFeasible
      };
    }
    else if (pickStrategy == 4)
    {
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
    else
    {
      productionCapacity = playerState.producers;
      soldiersToCreate = null;
      producersToCreate = null;

      return {
        soldiersToCreate: (productionCapacity / 2),
        producersToCreate: productionCapacity - soldiersToCreate
      }
    }
  }

  function onRoundEnd(roundResult) {
    lastObservedAttack = roundResult.them.launchedAttack ? roundResult.turnsPlayed : null;
  }

  return {
    meta: {
      name: 'ChanceBot',
      author: 'Nam Nguyen, nam.nguyen@spectrumhealth.org'
    },
    onRoundStart,
    playTurn,
    onRoundEnd
  };
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function player() {
  return createChanceBot();
}

export default player;
