class Match {
  constructor(config) {
    let defaults = {
      game: {},
      player1: {},
      player2: {},
      matchRules: { rounds: 7 },
      roundRules: { turns: (rules, roundNumber) => null } // Allow Round default to apply
    };
    let init = Object.assign({}, defaults, config);

    this.game = new GameDriver(init.game);
    this.player1 = new PlayerDriver(init.player1);
    this.player2 = new PlayerDriver(init.player2);

    this.matchRules = Object.assign({}, defaults.matchRules, init.matchRules);
    this.roundRules = Object.assign({}, defaults.roundRules, init.roundRules);

    this.roundResults = [];
  }

  start() {
    this.game.onMatchStart(this.matchRules);

    let matchRules = Object.assign({}, this.game.getMatchRules(), this.matchRules);

    this.player1.onMatchStart(matchRules); // TODO: give match rules
    this.player2.onMatchStart(matchRules);

    return this;
  }

  executeRound() {
    let { game, player1, player2, roundRules } = this;
    let round = new Round({ game, player1, player2, roundRules });

    this.roundResults.push(round.play());

    return this;
  }

  getResult() {
    return new MatchResult(this.roundResults);
  }

  play() {
    this.start();

    while (this.roundResults.length < this.matchRules.rounds) {
      this.executeRound();
    }

    return this.getResult();
  }
}

class MatchResult {
  constructor(roundResults) {
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
    let init = Object.assign({}, config);

    this.game = (init.game instanceof GameDriver) ? init.game : new GameDriver(init.game);

    this.player1 = (init.player1 instanceof PlayerDriver) ? init.player1 : new PlayerDriver(init.player1);
    this.player2 = (init.player2 instanceof PlayerDriver) ? init.player2 : new PlayerDriver(init.player2);

    this.turns = init.turns || 2;
    this.status = RoundStatus.NEW;
  }

  start() {
    if (this.status != RoundStatus.NEW)
      throw new Error(`Cannot start round unless round status is NEW (Currently: ${this.status})`);

    this.status = RoundStatus.IN_PROGRESS;
    this.turnsRemaining = this.turns;

    let basicRoundRules = { turns: this.turns };
    let endRoundCallback = (roundResult) => this.end(roundResult);
    this.game.onRoundStart(basicRoundRules, endRoundCallback);

    let roundRules = Object.assign({}, this.game.getRoundRules(), basicRoundRules);
    this.player1.onRoundStart(roundRules);
    this.player2.onRoundStart(roundRules);

    return this;
  }

  executeTurn() {
    if (this.status != RoundStatus.IN_PROGRESS)
      throw new Error(`Cannot execute turn unless round is IN_PROGRESS (Currently: ${this.status})`);

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

    this.player1.onRoundEnd(roundResult);
    this.player2.onRoundEnd(roundResult);

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
  onMatchStart() { callIfExists(this.game, 'onMatchStart', arguments); }
  getMatchRules() { return callIfExists(this.game, 'getMatchRules', arguments); }
  onRoundStart() { callIfExists(this.game, 'onRoundStart', arguments); }
  getRoundRules() { return callIfExists(this.game, 'getRoundRules', arguments); }
  getPlayer1TurnState() { return callIfExists(this.game, 'getPlayer1TurnState', arguments); }
  getPlayer2TurnState() { return callIfExists(this.game, 'getPlayer2TurnState', arguments); }
  playTurn() { return callIfExists(this.game, 'playTurn', arguments); }
  onNoRemainingTurnsInRound() { return callIfExists(this.game, 'onNoRemainingTurnsInRound', arguments); }
}

class PlayerDriver {
  constructor(player) { this.meta = 'PlayerDriver'; this.player = player; }
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
