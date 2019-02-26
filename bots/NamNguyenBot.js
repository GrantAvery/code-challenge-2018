
function createNamNguyenBot() {

  let currentTurn = null;
  let turnToBuildSoldiersOn = null;
  let lastObservedAttack = null;
  let pickStrategy = null;

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
    // currentTurn = 0;

    // pickStrategy = getRandomInt(1, 5);

    // //case 1 rules
    // currentTurn = 0;
    // turnToBuildSoldiersOn = lastObservedAttack || roundRules.turns;

    // //case 2 rules
    // this.currentTurn = 0;
    // this.turnToAttack = getRandomInt(1, roundRules.turns + 1); // turns + 1 to enable never attacking

    // //case 3 rules
    // this.roundRules = roundRules;

    // //case 4 rules
    // this.turnsInThisRound = roundRules.turns;
    // this.currentTurn = 0;

  }

  function playTurn(playerState) {
    // let productionCapacity = null;
    // let soldiersToCreate = null;
    // let producersToCreate = null;

    // switch (pickStrategy) {
    //   case[1]:{
    //     productionCapacity = playerState.producers;

    //     currentTurn++;
    
    //     return (currentTurn >= turnToBuildSoldiersOn)
    //       ? { newSoldiers: productionCapacity }
    //       : { newProducers: productionCapacity };
    //   }
    //   case[2]:{
    //     productionCapacity = playerState.producers;
    //     soldiersToCreate = getRandomInt(0, productionCapacity);
    //     producersToCreate = productionCapacity - soldiersToCreate;
    
    //     this.currentTurn++;
    
    //     return {
    //       newProducers: producersToCreate,
    //       newSoldiers: soldiersToCreate,
    //       launchAttack: (this.currentTurn >= this.turnToAttack)
    //     };
    //   }
    //   case[3]:{
    //     let minimumSoldiersNeededToWin = this.roundRules.defenderBonus + 1;
    //     soldiersToCreate = playerState.producers;
    //     let totalSoldiersAtEndOfThisRound = playerState.soldiers + soldiersToCreate;
    //     let isWinFeasible = totalSoldiersAtEndOfThisRound >= minimumSoldiersNeededToWin;
    
    //     return {
    //       newProducers: 0,
    //       newSoldiers: soldiersToCreate,
    //       launchAttack: isWinFeasible
    //     };
    //   }
    //   case[4]:{
    //     this.currentTurn++;

    //     if (this.turnsInThisRound > this.currentTurn) {
    //       return {
    //         newProducers: playerState.producers
    //       };
    //     } else {
    //       return {
    //         newSoldiers: playerState.producers,
    //       };
    //     }
    //   }
    //   default:{
    //     productionCapacity = playerState.producers;
    //     soldiersToCreate = null;
    //     producersToCreate = null;

    //     return {
    //       soldiersToCreate: (productionCapacity / 2),
    //       producersToCreate: productionCapacity - soldiersToCreate
    //     }
    //   }
      
    //}
  }

  function onRoundEnd(roundResult) {
    lastObservedAttack = roundResult.them.launchedAttack ? roundResult.turnsPlayed : null;
  }

  return {
    meta: {
      name: 'NamNguyenBot',
      author: 'Nam Nguyen, nam.nguyen@spectrumhealth.org'
    },
    onRoundStart,
    playTurn,
    onRoundEnd
  };
};

function player() {
  return createNamNguyenBot;
}

export default player;
