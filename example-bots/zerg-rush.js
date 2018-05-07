/**
 * This bot's strategy is to create exclusively soldiers until there are enough
 * to feasibly win a round, then to launch an attack. The ability to feasibly 
 * win comes from having the patience to wait until the number of soldiers at
 * the end of the round is expected to exceed the "defender's advantage" bonus.
 * 
 * This strategy will win any round where the opponent doesn't create any soldiers
 * prior to the attack.
 */
class ZergRusher {

  constructor() {
    this.meta = {
      name: 'Zergy McZergface (Example Bot)',
      author: 'Bravo LT'
    };
  }

  onRoundStart(roundRules) {
    this.roundRules = roundRules;
  };

  playTurn(playerState) {
    let minimumSoldiersNeededToWin = this.roundRules.defenderBonus + 1;
    let soldiersToCreate = playerState.producers;
    let totalSoldiersAtEndOfThisRound = playerState.soldiers + soldiersToCreate;
    let isWinFeasible = totalSoldiersAtEndOfThisRound >= minimumSoldiersNeededToWin;

    return {
      newProducers: 0,
      newSoldiers: soldiersToCreate,
      launchAttack: isWinFeasible
    };
  }
}

function player() {
  return new ZergRusher();
}

export default player;
