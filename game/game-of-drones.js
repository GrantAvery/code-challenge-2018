import { PlayOutcome, RoundResult } from '../framework/framework.js';

const DEFENDER_ADVANTAGE_BONUS = 1;

class GameOfDrones {

  /* +++++++++++++++ */
  /* Lifecycle Hooks */

  getMatchRules() { /* No special rules to report for this game at the Match level */ }

  onMatchStart() { /* Nothing special on Match start */ }

  getRoundRules() {
    return { turns: 10 };
  }

  onRoundStart(roundRules, signalEndOfRound) {
    this.initializeRound(signalEndOfRound);
  }

  getPlayer1TurnState() {
    return this.player1.toSimpleState();
  }

  getPlayer2TurnState() {
    return this.player2.toSimpleState();
  }

  playTurn(player1Actions, player2Actions) {
    this.handleTurn(player1Actions, player2Actions);
  }

  onNoRemainingTurnsInRound() {
    this.triggerClash();
  }

  /* END Lifecycle Hooks */
  /* +++++++++++++++++++ */

  initializeRound(signalEndOfRound) {
    this.player1 = new PlayerState();
    this.player2 = new PlayerState();
    this.signalEndOfRound = signalEndOfRound;
    this.roundResult = null; 
  }

  handleTurn(player1Actions, player2Actions) {
    this.handlePlayerActions(this.player1, player1Actions);
    this.handlePlayerActions(this.player2, player2Actions);

    if (this.isAnyPlayerAttacking()) {
      this.triggerClash();
    }
  }

  handlePlayerActions(player, actions) {
    let productionCapacity = player.producers,
        newProducers = actions.newProducers || 0,
        newSoldiers = actions.newSoldiers || 0;

    if (newProducers < productionCapacity) {
      productionCapacity -= newProducers;
    } else {
      newProducers = productionCapacity;
      productionCapacity = 0;
    }

    if (newSoldiers < productionCapacity) {
      productionCapacity -= newSoldiers;
    } else {
      newSoldiers = productionCapacity;
      productionCapacity = 0;
    }

    player.producers += newProducers;
    player.soldiers += newSoldiers;
    player.actions.push(actions);
  }

  isAnyPlayerAttacking() {
    return this.player1.isAttacking() || this.player2.isAttacking();
  }

  triggerClash() {
    let winner = this.evaluateClash();
    let result = winner === this.player1 ? PlayOutcome.PLAYER_1
               : winner === this.player2 ? PlayOutcome.PLAYER_2
               : PlayOutcome.DRAW;

    this.roundResult = new GameRoundResult(this.player1, this.player2, result);

    this.signalEndOfRound(this.roundResult);
  }

  evaluateClash() {
    let aggressor = determineAggressor(this.player1, this.player2);
    if (!aggressor) {
      return decideSoldierVsSoldierClash(this.player1, this.player2);
    } else {
      let defender = getOtherPlayer(aggressor, this.player1, this.player2);
      return decideAggressorVsDefenderClash(aggressor, defender);
    }
  }
}

function determineAggressor(player1, player2) {
  if (player1.isAttacking() == player2.isAttacking()) {
    return null;
  } else {
    return player1.isAttacking() ? player1 : player2;
  }
}

function decideSoldierVsSoldierClash(player1, player2) {
  if (player1.soldiers == player2.soldiers) {
    return null;
  } else {
    return player1.soldiers > player2.soldiers ? player1 : player2;
  }
}

function decideAggressorVsDefenderClash(aggressor, defender) {
  let aggressorPower = aggressor.soldiers,
      defenderPower = defender.soldiers + DEFENDER_ADVANTAGE_BONUS;
  return aggressorPower > defenderPower ? aggressor : defender;
}

function getOtherPlayer(player, player1, player2) {
  return player === player1 ? player2 : player1;
}

class PlayerState {
  constructor() {
    this.producers = 1;
    this.soldiers = 0;
    this.actions = [];
  }

  isAttacking() {
    let lastActions = this.actions.slice(-1)[0];
    return lastActions && lastActions.launchAttack == true;
  }

  toSimpleState() {
    return {
      producers: this.producers,
      soldiers: this.soldiers
    }
  }
}

class GameRoundResult extends RoundResult {
  constructor(player1, player2, outcome) {
    super(outcome);
    let { player1Attackers, player1Workers } = player1;
    let { player2Attackers, player2Workers } = player2;
    this.player1 = player1.toSimpleState();
    this.player2 = player2.toSimpleState();
    this.outcome = outcome;
  }
}

const PlayerActions = {
  TRAIN_ATTACKER: 'TRAIN_ATTACKER',
  BUILD_WORKER: 'BUILD_WORKER',
  ATTACK: 'ATTACK'
};

const INVALID_ACTION = 'INVALID_ACTION';

export { GameOfDrones, determineAggressor, PlayerActions };
