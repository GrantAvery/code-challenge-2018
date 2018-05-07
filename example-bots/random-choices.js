/**
 * This player's strategy is to be unpredictable. At the start of the round, it 
 * will randomly decide which turn it should launch an attack, and during each
 * turn it will randomly create producers and/or soldiers.
 */
class RandomPlayer {

  constructor() {
    this.meta = {
      name: 'Randomonium (Example Bot)',
      author: 'Bravo LT'
    };
  }

  onRoundStart(roundRules) {
    this.currentTurn = 0;
    this.turnToAttack = getRandomInt(1, roundRules.turns + 1); // turns + 1 to enable never attacking
  };

  playTurn(playerState) {
    let productionCapacity = playerState.producers;
    let soldiersToCreate = getRandomInt(0, productionCapacity);
    let producersToCreate = productionCapacity - soldiersToCreate;

    this.currentTurn++;

    return {
      newProducers: producersToCreate,
      newSoldiers: soldiersToCreate,
      launchAttack: (this.currentTurn >= this.turnToAttack)
    };
  }
} 

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPlayer() {
  return new RandomPlayer();
}

export default getPlayer;
