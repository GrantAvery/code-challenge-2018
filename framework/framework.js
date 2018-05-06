class Match {
  constructor(config) {
    let defaults = {
      game: {},
      player1: {},
      player2: {},
      rounds: 7,
    };
    let init = Object.assign({}, defaults, config);

    this.game = new GameDriver(init.game);
    this.player1 = new PlayerDriver(init.player1);
    this.player2 = new PlayerDriver(init.player2);

    this.rules = Object.assign({}, this.game.getMatchRules());
    this.rules.rounds = this.rules.rounds || init.rounds;

    this.rounds = this.rules.rounds;
    if (this.rounds < 1) {
      throw new Error('Match must have at least 1 Round');
    }

    this.roundResults = [];
  }

  start() {
    this.game.onMatchStart();
    this.player1.onMatchStart(this.rules);
    this.player2.onMatchStart(this.rules);

    return this;
  }

  executeRound() {
    let { game, player1, player2 } = this;
    let round = new Round({ game, player1, player2 });

    this.roundResults.push(round.play());

    return this;
  }

  getResult() {
    return new MatchResult(this.player1.meta, this.player2.meta, this.roundResults);
  }

  play() {
    this.start();

    while (this.roundResults.length < this.rounds) {
      this.executeRound();
    }

    return this.getResult();
  }
}

class MatchResult {
  constructor(player1, player2, roundResults) {
    this.player1 = player1;
    this.player2 = player2;
    this.roundResults = roundResults;
    this.compute();
  }

  compute() {
    let player1Wins = 0,
        player2Wins = 0,
        draws = 0,
        ambiguous = 0,
        error = 0;

    for (var result of this.roundResults) {
      if (!result || !result.outcome) {
        ambiguous++;
        continue;
      }
      switch (result.outcome) {
        case PlayOutcome.PLAYER_1:
          player1Wins++;
          break;
        case PlayOutcome.PLAYER_2:
          player2Wins++;
          break;
        case PlayOutcome.DRAW:
          draws++;
          break;
        case PlayOutcome.ERROR:
          error++;
          break;
        default:
          ambiguous++;
      }
    }

    this.roundTotals = { player1Wins, player2Wins, draws, error, ambiguous };

    this.outcome = player1Wins > player2Wins ? PlayOutcome.PLAYER_1
                 : player1Wins < player2Wins ? PlayOutcome.PLAYER_2
                 : PlayOutcome.DRAW;
  }
}

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

const PlayOutcome = {
  PLAYER_1: 'PLAYER 1',
  PLAYER_2: 'PLAYER 2',
  DRAW: 'DRAW',
  ERROR: 'ERROR'
};

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

class GameDriver {
  constructor(game) { this.meta = 'GameDriver'; this.game = game; }
  getMatchRules() { return callIfExists(this.game, 'getMatchRules', arguments); }
  onMatchStart() { callIfExists(this.game, 'onMatchStart', arguments); }
  getRoundRules() { return callIfExists(this.game, 'getRoundRules', arguments); }
  onRoundStart() { callIfExists(this.game, 'onRoundStart', arguments); }
  getPlayer1TurnState() { return callIfExists(this.game, 'getPlayer1TurnState', arguments); }
  getPlayer2TurnState() { return callIfExists(this.game, 'getPlayer2TurnState', arguments); }
  playTurn() { return callIfExists(this.game, 'playTurn', arguments); }
  onNoRemainingTurnsInRound() { return callIfExists(this.game, 'onNoRemainingTurnsInRound', arguments); }
  getPlayer1RoundResult() { return callIfExists(this.game, 'getPlayer1RoundResult', arguments); }
  getPlayer2RoundResult() { return callIfExists(this.game, 'getPlayer2RoundResult', arguments); }
  onRoundEnd() { return callIfExists(this.game, 'onRoundEnd', arguments); }
}

class PlayerDriver {
  constructor(player) {
    this.player = player;

    this.meta = typeof player.meta == 'object'
      ? player.meta
      : { name: 'Anonymous Player'};
  }
  onMatchStart() { callIfExists(this.player, 'onMatchStart', arguments); }
  onRoundStart() { callIfExists(this.player, 'onRoundStart', arguments); }
  playTurn() { return callIfExists(this.player, 'playTurn', arguments); }
  onRoundEnd() { callIfExists(this.player, 'onRoundEnd', arguments); }
}

function callIfExists(obj, method, ...args) {
  if (obj && typeof obj[method] == 'function')
    return obj[method].apply(obj, ...args);
}

export { Match, MatchResult, Round, RoundResult, PlayOutcome, RoundStatus };
