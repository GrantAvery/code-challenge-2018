/**
 * This bot's strategy is to try to predict when they will be attacked, and to 
 * create as many soldiers as possible at the last moment, so that they can
 * survive the attack and win via the defender's bonus. The bot predicts which 
 * turn they will be attacked by assuming the opponent will always repeat their 
 * strategy from the previous round.
 * 
 * This strategy will defeat any bot who attacks prior to the end of the Round
 * and who uses a consistent build order (or one that repeats prior builds often)
 */
function createAdaptiveDefender() {

  let currentTurn = null;
  let turnToBuildSoldiersOn = null;
  let lastObservedAttack = null;

  function onRoundStart(roundRules) {
    currentTurn = 0;
    turnToBuildSoldiersOn = lastObservedAttack || roundRules.turns;
  }

  function playTurn(playerState) {
    let productionCapacity = playerState.producers;

    currentTurn++;

    return (currentTurn >= turnToBuildSoldiersOn)
      ? { newSoldiers: productionCapacity }
      : { newProducers: productionCapacity };
  }

  function onRoundEnd(roundResult) {
    lastObservedAttack = roundResult.them.attackLaunched ? roundResult.turnsPlayed : null;
  }

  /* Return our Player object */
  return {
    meta: {
      name: 'Adaptive Defender (Example Bot)',
      author: 'Bravo LT'
    },
    onRoundStart,
    playTurn,
    onRoundEnd
  };
};

function player() {
  return createAdaptiveDefender();
}

export default player;
