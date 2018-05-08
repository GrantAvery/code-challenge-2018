import { PlayOutcome } from './consts.js';
import { Match } from './match.js';

class Tournament {
  constructor(game) {
    if (!game) {
      throw new Error('Tournament cannot be created without a Game to play');
    }
    this.game = game;
    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  prepareBracket() {
    this.bracket = new Bracket(this.game, this.players);
    return this.bracket;
  }
}

class RoundRobin {
  constructor(game, initPlayers) {
    if (!game) {
      throw new Error('Cannot run Tournaments without a Game');
    }
    if (!initPlayers || initPlayers.length < 1) {
      throw new Error('Cannot run Tournament without any Players');
    }

    // Validate players (must have meta.name, and it must be unique)
    let names = {};
    let players = [];
    for (let player of initPlayers) {
      if (!player || !player.meta || !player.meta.name) {
        console.warn("Invalid Player or Player missing metadata -- player omitted from tournament");
        continue;
      }
      if (player.meta.name in names) {
        console.warn("Duplicate Player name detected -- player omitted from tournament");
        continue;
      }
      names[player.meta.name] = 1;
      players.push(player);
    }

    if (players.length < 1) {
      throw new Error("No eligible players available to run Tournament");
    }

    let rounds = [];

    // Add 'Bye' player, if needed
    if (players.length % 2 == 1) {
      players.push({ meta: { name: 'Dummy Bot (Bye)' }});
    }

    // Setup stats
    this.statistics = {};
    for (let player of players) {
      this.statistics[player] = {}; // TODO: Stats
    }

    // Setup rounds
    for (let roundIndex = 0; roundIndex < players.length - 1; roundIndex++) {
      // Prepare the players array for round creation
      let roundPlayers = players.slice();
      let lockedPlayer = roundPlayers.shift();

      for (let i = 0; i < roundIndex; i++) {
        roundPlayers.unshift(roundPlayers.pop());
      }
      roundPlayers.unshift(lockedPlayer);

      let round = [];

      // Create the round
      while (roundPlayers.length > 0) {
        round.push(new Match({
          game,
          player1: roundPlayers.shift(),
          player2: roundPlayers.shift()
        }));
      }

      rounds.push(round);

      //console.log('ROUND ' + roundIndex);
      //round.forEach(match => console.log(match.player1.meta.name + ' vs ' + match.player2.meta.name));
    }

    this.rounds = rounds;
  }
}

class Bracket {
  constructor(game, players) {
    if (!game) {
      throw new Error('Cannot create Bracket without a Game');
    }
    if (!players || players.length < 1) {
      throw new Error('Cannot create Bracket without any Players');
    }

  //   players = players.slice(); // Copy the array to avoid mutating original

  //   let matches = [];

  //   while (players.length > 0) {
  //     let player1 = players.pop();
  //     let player2 = players.pop();
  //   }
  }
}

class BracketMatch {
  constructor(game, player1, player2) {
    if (!game) {
      throw new Error('Cannot create BracketMatch without a Game');
    }
    if (!player1 && !player2) {
      throw new Error('Cannot create BracketMatch without any Players');
    }
    this.game = game;
    this.player1 = player1;
    this.player2 = player2;
    this.matchResult = null;
  }

  resolve() {
    if (!this.player1 || !this.player2) {
      return this.player1 || this.player2;
    }

    if (!this.matchResult) {
      this.matchResult = new Match({
        game: this.game,
        player1: this.player1,
        player2: this.player2,
        drawAllowed: false
      }).play();
    }

    switch(this.matchResult.outcome) {
      case PlayOutcome.PLAYER_1:
        return this.player1;
      case PlayOutcome.PLAYER_2:
        return this.player2;
      default:
        throw new Error('Match had no clear winner - cannot resolve BracketMatch!');
    }
  }

  getMatchResult() {
    return this.matchResult;
  }
}

export { Tournament, Bracket, BracketMatch, RoundRobin }
