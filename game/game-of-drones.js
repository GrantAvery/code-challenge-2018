import { PlayOutcome, RoundResult } from '../framework/framework.js';

class GameOfDrones {

  /* +++++++++++++++ */
  /* Lifecycle Hooks */

  getMatchRules() { /* No special rules to report for this game at the Match level */ }

  onMatchStart() { /* Nothing special on Match start */ }

  getRoundRules(roundNumber) { /* No special rules to report for this game at the Round level */ }

  onRoundStart(roundRules, signalEndOfRound) {
    this.initializeRound(signalEndOfRound);
  }

  getPlayer1TurnState() {
    return this.player1.toSimpleState();
  }

  getPlayer2TurnState() {
    return this.player2.toSimpleState();
  }

  playTurn(player1Choice, player2Choice) {
    this.handleTurn(player1Choice, player2Choice);
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

  handleTurn(player1Choice, player2Choice) {
    this.handlePlayerChoice(this.player1, player1Choice);
    this.handlePlayerChoice(this.player2, player2Choice);

    if (this.isAnyPlayerAttacking()) {
      this.triggerClash();
    }
  }

  handlePlayerChoice(player, choice) {
    switch (choice) {
      case PlayerActions.TRAIN_ATTACKER:
        player.attackers++;
        break;
      case PlayerActions.BUILD_WORKER:
        player.workers++;
        break;
      case PlayerActions.ATTACK:
        break;
      default:
        choice = INVALID_ACTION;
    }
    player.choices.push(choice);
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
      return playerWithMostAttackers(this.player1, this.player2);
    }

    let defender = getOtherPlayer(aggressor, this.player1, this.player2);

    return aggressor.attackers > defender.attackers ? aggressor : defender;
  }
}

function determineAggressor(player1, player2) {
  if (player1.isAttacking() && player2.isAttacking()) {
    return playerWithMostAttackers(player1, player2);
  } else {
    return player1.isAttacking() ? player1 : player2;
  }
}

function playerWithMostAttackers(player1, player2) {
  if (player1.attackers == player2.attackers) {
    return null;
  } else {
    return player1.attackers > player2.attackers ? player1 : player2;
  }
}

function getOtherPlayer(player, player1, player2) {
  return player === player1 ? player2 : player1;
}

class PlayerState {
  constructor() {
    this.attackers = 1;
    this.workers = 1;
    this.choices = [];
  }

  isAttacking() {
    return this.choices.slice(-1) == PlayerActions.ATTACK;
  }

  toSimpleState() {
    return {
      attackers: this.attackers,
      workers: this.workers
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
