class SimpleCodeClash {

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

  onRoundEnd() { /* Nothing special on Round End */ }

  getRoundResults() {
    return this.roundResults;
  }

  /* END Lifecycle Hooks */
  /* +++++++++++++++++++ */

  initializeRound(signalEndOfRound) {
    this.player1 = new PlayerState();
    this.player2 = new PlayerState();
    this.signalEndOfRound = signalEndOfRound;
    this.roundResults = null; 
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
      case PlayerActions.BUILD_DEFENSE:
        player.defenders++;
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
    let result = winner === this.player1 ? RoundOutcome.PLAYER_1
               : winner === this.player2 ? RoundOutcome.PLAYER_2
               : RoundOutcome.DRAW;

    this.results = new RoundResults(this.player1, this.player2, result);

    this.signalEndOfRound();
  }

  evaluateClash() {
    let aggressor = determineAggressor(this.player1, this.player2);

    if (!aggressor) {
      return playerWithMostAttackers(this.player1, this.player2)
          || playerWithMostDefenders(this.player1, this.player2);
    }

    let defender = getOtherPlayer(aggressor, this.player1, this.player2);

    return aggressor.attackers > defender.defenders ? aggressor : defender;
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

function playerWithMostDefenders(player1, player2) {
  if (player1.defenders == player2.defenders) {
    return null;
  } else {
    return player1.defenders > player2.defenders ? player1 : player2;
  }
}

function getOtherPlayer(player, player1, player2) {
  return player === player1 ? player2 : player1;
}

class PlayerState {
  constructor() {
    this.attackers = 1;
    this.defenders = 0;
    this.choices = [];
  }

  isAttacking() {
    return this.choices.slice(-1) == PlayerActions.ATTACK;
  }

  toSimpleState() {
    return {
      attackers: this.attackers,
      defenders: this.defenders
    }
  }
}

class RoundResults {
  constructor(player1, player2, result) {
    let { player1Attackers, player1Defenders } = player1;
    let { player2Attackers, player2Defenders } = player2;
    this.player1 = player1.toSimpleState();
    this.player2 = player2.toSimpleState();
    this.result = result;
  }
}

const PlayerActions = {
  TRAIN_ATTACKER: 'TRAIN_ATTACKER',
  BUILD_DEFENSE: 'BUILD_DEFENSE',
  ATTACK: 'ATTACK'
}

const INVALID_ACTION = 'INVALID_ACTION';

const RoundOutcome = {
  PLAYER_1: 'PLAYER_1',
  PLAYER_2: 'PLAYER_2',
  DRAW: 'DRAW'
}

export { SimpleCodeClash, determineAggressor, PlayerActions };
