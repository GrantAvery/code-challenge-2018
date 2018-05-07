import { PlayOutcome } from './consts.js';
import { GameDriver, PlayerDriver } from './drivers.js';
import { Round } from './round.js';

class Match {
  constructor(config) {
    let defaults = {
      game: {},
      player1: {},
      player2: {},
      rounds: 7,
      drawAllowed: true
    };
    let init = Object.assign({}, defaults, config);

    this.game = new GameDriver(init.game);
    this.player1 = new PlayerDriver(init.player1);
    this.player2 = new PlayerDriver(init.player2);

    this.rules = Object.assign({}, this.game.getMatchRules());
    this.rules.rounds = this.rules.rounds || init.rounds;
    this.rules.drawAllowed = init.drawAllowed;

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
    return new MatchResult(this.player1.meta, this.player2.meta, this.roundResults, this.rules.drawAllowed);
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
  constructor(player1, player2, roundResults, drawAllowed=true) {
    this.roundResults = roundResults;

    this.outcomeDecidedByRandomChance = false;
    this.compute();

    if (this.outcome == 'DRAW' && !drawAllowed) {
      this.outcome = Math.round(Math.random()) + 1 == 1
        ? PlayOutcome.PLAYER_1
        : PlayOutcome.PLAYER_2;
      this.outcomeDecidedByRandomChance = true;
    }

    this.player1 = player1;
    this.player2 = player2;
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

export { Match, MatchResult };
