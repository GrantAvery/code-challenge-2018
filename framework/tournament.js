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

export { Tournament, Bracket, BracketMatch }
