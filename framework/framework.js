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

  getMatchResults() {
    let player1Wins, player2Wins, draws, cannotDetermine, error = 0;

    for (var result of this.roundResults) {
      if (!result || !result.winner) {
        cannotDetermine++;
        continue;
      }
      switch (result.winner) {
        case 'PLAYER 1':
          player1Wins++;
          break;
        case 'PLAYER 2':
          player2Wins++;
          break;
        case 'DRAW':
          draws++;
          break;
        case 'ERROR':
          error++;
          break;
        default:
          cannotDetermine++;
      }
    }

    let overallResult = player1Wins > player2Wins ? 'PLAYER 1' : player1Wins < player2Wins ? 'PLAYER 2' : 'DRAW';
    return {
      results: { player1Wins, player2Wins, draws, error, cannotDetermine },
      overallResult
    }
  }

  play() {
    this.start();

    while (this.roundResults.length < this.matchRules.rounds) {
      this.executeRound();
    }

    return this.getMatchResults();
  }
}

class Round {
  constructor(config) {
    let init = Object.assign({}, config);

    this.game = new GameDriver(init.game);

    this.player1 = new PlayerDriver(init.player1);
    this.player2 = new PlayerDriver(init.player2);
    this.turns = init.turns || 2;
    this.status = 'NEW';
  }

  start() {
    if (this.status != 'NEW')
      throw new Error(`Cannot start round unless round status is NEW (Currently: ${this.status})`);

    this.status = 'IN_PROGRESS';
    this.turnsRemaining = this.turns;

    let basicRoundRules = { turns: this.turns };
    this.game.onRoundStart(basicRoundRules, () => { this.end() });

    let roundRules = Object.assign({}, this.game.getRoundRules(), basicRoundRules);
    this.player1.onRoundStart(roundRules);
    this.player2.onRoundStart(roundRules);

    return this;
  }

  executeTurn() {
    if (this.status != 'IN_PROGRESS')
      throw new Error(`Cannot execute turn unless round is IN_PROGRESS (Currently: ${this.status})`);

    let player1TurnState = this.game.getPlayer1TurnState(),
      player2TurnState = this.game.getPlayer2TurnState();

    let player1Actions = this.player1.playTurn(player1TurnState),
      player2Actions = this.player2.playTurn(player2TurnState);

    this.game.playTurn(player1Actions, player2Actions);

    this.turnsRemaining--;

    if (this.turnsRemaining == 0 && this.status == 'IN_PROGRESS') {
      this.game.onNoRemainingTurnsInRound();
      this.end();
    }

    return this;
  }

  end() {
    if (this.status == 'FINISHED') {
      return;
    } else if (this.status != 'IN_PROGRESS') {
      throw new Error(`Cannot execute clash unless round is IN_PROGRESS (Currently: ${this.status})`);
    }

    this.status = 'FINISHED';

    this.player1.onRoundEnd();
    this.player2.onRoundEnd();
    this.game.onRoundEnd();

    return this;
  }

  getResults() {
    return this.game.getRoundResults();
  }

  play() {
    this.start();

    while (this.status == 'IN_PROGRESS') {
      this.executeTurn();
    }

    return this.getResults();
  }
}

class GameDriver {
  constructor(game) { this.game = game; }
  onMatchStart() { callIfExists(this.game, 'onMatchStart', arguments); }
  getMatchRules() { return callIfExists(this.game, 'getMatchRules', arguments); }
  onRoundStart() { callIfExists(this.game, 'onRoundStart', arguments); }
  getRoundRules() { return callIfExists(this.game, 'getRoundRules', arguments); }
  getPlayer1TurnState() { return callIfExists(this.game, 'getPlayer1TurnState', arguments); }
  getPlayer2TurnState() { return callIfExists(this.game, 'getPlayer2TurnState', arguments); }
  playTurn() { return callIfExists(this.game, 'playTurn', arguments); }
  onNoRemainingTurnsInRound() { return callIfExists(this.game, 'onNoRemainingTurnsInRound', arguments); }
  onRoundEnd() { callIfExists(this.game, 'onRoundEnd', arguments); }
  getRoundResults() { return callIfExists(this.game, 'getRoundResults', arguments); }
}

class PlayerDriver {
  constructor(player) { this.player = player; }
  onMatchStart() { callIfExists(this.player, 'onMatchStart', arguments); }
  onRoundStart() { callIfExists(this.player, 'onRoundStart', arguments); }
  playTurn() { return callIfExists(this.player, 'playTurn', arguments); }
  onRoundEnd() { callIfExists(this.player, 'onRoundEnd', arguments); }
}

function callIfExists(obj, method, ...args) {
  if (obj && typeof obj[method] == 'function')
    return obj[method].apply(obj, ...args);
}

export { Match, Round };
