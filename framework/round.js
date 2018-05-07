import { PlayOutcome } from './consts.js';
import { GameDriver, PlayerDriver } from './drivers.js';

class Round {
  constructor(config) {
    let defaults = {
      game: {},
      player1: {},
      player2: {},
      turns: 2
    }
    let init = Object.assign({}, defaults, config);

    this.game = (init.game instanceof GameDriver) ? init.game : new GameDriver(init.game);
    this.player1 = (init.player1 instanceof PlayerDriver) ? init.player1 : new PlayerDriver(init.player1);
    this.player2 = (init.player2 instanceof PlayerDriver) ? init.player2 : new PlayerDriver(init.player2);

    this.rules = Object.assign({}, this.game.getRoundRules());

    this.rules.turns = this.rules.turns || init.turns;

    this.turns = this.rules.turns;
    if (this.turns < 1) {
      throw new Error('Round must have at least 1 turn');
    }

    this.status = RoundStatus.NEW;
  }

  start() {
    if (this.status != RoundStatus.NEW) {
      throw new Error(`Cannot start round unless round status is NEW (Currently: ${this.status})`);
    }

    this.status = RoundStatus.IN_PROGRESS;
    this.turnsRemaining = this.turns;

    let endRoundCallback = (roundResult) => this.end(roundResult);
    this.game.onRoundStart(endRoundCallback);

    this.player1.onRoundStart(this.rules);
    this.player2.onRoundStart(this.rules);

    return this;
  }

  executeTurn() {
    if (this.status != RoundStatus.IN_PROGRESS) {
      throw new Error(`Cannot execute turn unless round is IN_PROGRESS (Currently: ${this.status})`);
    }

    let player1TurnState = this.game.getPlayer1TurnState(),
        player2TurnState = this.game.getPlayer2TurnState();

    let player1Actions = this.player1.playTurn(player1TurnState),
        player2Actions = this.player2.playTurn(player2TurnState);

    this.game.playTurn(player1Actions, player2Actions);

    this.turnsRemaining--;

    if (this.turnsRemaining == 0 && this.status == RoundStatus.IN_PROGRESS) {
      this.game.onNoRemainingTurnsInRound();
      this.end();
    }

    return this;
  }

  end(roundResult) {
    if (this.status == RoundStatus.FINISHED) {
      return;
    } else if (this.status != RoundStatus.IN_PROGRESS) {
      throw new Error(`Cannot end Round unless it is IN_PROGRESS (Currently: ${this.status})`);
    }

    this.result = roundResult || new RoundResult(PlayOutcome.ERROR);

    this.status = RoundStatus.FINISHED;

    let player1RoundResult = this.game.getPlayer1RoundResult() || this.result,
        player2RoundResult = this.game.getPlayer2RoundResult() || this.result;

    this.player1.onRoundEnd(player1RoundResult);
    this.player2.onRoundEnd(player2RoundResult);
    this.game.onRoundEnd();

    return this;
  }

  getResult() {
    return this.result;
  }

  play() {
    this.start();

    while (this.status == RoundStatus.IN_PROGRESS) {
      this.executeTurn();
    }

    return this.getResult();
  }
}

const RoundStatus = {
  NEW: 'NEW',
  IN_PROGRESS: 'IN_PROGRESS',
  FINISHED: 'FINISHED'
};

class RoundResult {
  constructor(outcome) {
    this.outcome = outcome;
  }
}

export { Round, RoundResult, RoundStatus };
