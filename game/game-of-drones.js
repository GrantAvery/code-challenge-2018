import { PlayOutcome, RoundResult } from '../framework/framework.js';

const DEFENDER_ADVANTAGE_BONUS = 1;

class GameOfDrones {
  constructor(config) {
    let defaultRules = { rounds: 10, turns: 10 };
    let configuredRules = Object.assign({}, defaultRules, config);

    this.matchRules = { rounds: configuredRules.rounds };
    
    this.defenderBonus = configuredRules.defenderBonus || 1;
    this.turnCountGenerator = (typeof configuredRules.turns == 'function')
      ? configuredRules.turns
      : () => configuredRules.turns;

    this.roundNumber = 1;
  }

  /* +++++++++++++++ */
  /* Lifecycle Hooks */

  getMatchRules(signalEndOfMatch) {
    return this.matchRules;
  }

  onMatchStart() { /* Nothing special on Match start */ }

  getRoundRules() {
    return {
      turns: this.turnCountGenerator(this.roundNumber),
      defenderBonus: this.defenderBonus
    };
  }

  onRoundStart(signalEndOfRound) {
    this.initializeRound(signalEndOfRound);
    this.roundNumber++;
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

  getPlayer1RoundResult() {
    return this.buildPlayerRoundResult(this.player1);
  }

  getPlayer2RoundResult() {
    return this.buildPlayerRoundResult(this.player2);
  }

  onRoundEnd() { /* Nothing special on Round end */ }

  /* END Lifecycle Hooks */
  /* +++++++++++++++++++ */

  initializeRound(signalEndOfRound) {
    this.signalEndOfRound = signalEndOfRound;

    this.player1 = new PlayerState();
    this.player2 = new PlayerState();
    this.turnsPlayed = 0;
    this.roundResult = null; 
  }

  handleTurn(player1Actions, player2Actions) {
    this.turnsPlayed++;

    this.handlePlayerActions(this.player1, player1Actions);
    this.handlePlayerActions(this.player2, player2Actions);

    if (this.isAnyPlayerAttacking()) {
      this.triggerClash();
    }
  }

  handlePlayerActions(player, actions) {
    let productionCapacity = player.producers,
        newProducers = actions && actions.newProducers || 0,
        newSoldiers = actions && actions.newSoldiers || 0;

    newProducers = newProducers > 0 ? newProducers : 0;
    newSoldiers = newSoldiers > 0 ? newSoldiers : 0;

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

    this.roundResult = this.buildRoundResult(winner);

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

  buildRoundResult(winner) {
    let outcome = winner === this.player1 ? PlayOutcome.PLAYER_1
               : winner === this.player2 ? PlayOutcome.PLAYER_2
               : PlayOutcome.DRAW;

    return new GameRoundResult(this.player1, this.player2, outcome, this.turnsPlayed);
  }

  buildPlayerRoundResult(player) {
    let winner = this.roundResult.outcome == PlayOutcome.PLAYER_1 ? this.player1
               : this.roundResult.outcome == PlayOutcome.PLAYER_2 ? this.player2
               : null;

    let otherPlayer = getOtherPlayer(player, this.player1, this.player2);

    let playerOutcome = winner == null ? PlayerOutcome.DRAW
                      : winner == player ? PlayerOutcome.WIN
                      : PlayerOutcome.LOSE;

    return new PlayerRoundResult(player, otherPlayer, playerOutcome, this.turnsPlayed);
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

  toRoundEndState() {
    return {
      producers: this.producers,
      soldiers: this.soldiers,
      launchedAttack: this.isAttacking()
    };
  }
}

class GameRoundResult extends RoundResult {
  constructor(player1, player2, outcome, turnsPlayed) {
    super(outcome);
    this.turnsPlayed = turnsPlayed;
    this.player1 = player1.toRoundEndState();
    this.player2 = player2.toRoundEndState();
  }
}

const PlayerOutcome = {
  WIN: 'WIN',
  LOSE: 'LOSE',
  DRAW: 'DRAW'
}

class PlayerRoundResult extends RoundResult {
  constructor(player, otherPlayer, playerOutcome, turnsPlayed) {
    super(playerOutcome);
    this.turnsPlayed = turnsPlayed;
    this.you = player.toRoundEndState();
    this.them = otherPlayer.toRoundEndState();
  }
}

export { GameOfDrones, determineAggressor };
