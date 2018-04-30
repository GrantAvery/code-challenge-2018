import { RoundResult, PlayOutcome } from '../framework/framework.js';
import { Tournament, Bracket, BracketMatch } from './tournament.js';

describe('BracketMatch', () => {
  let dummyGame = {};
  let dummyPlayer = {};

  it('should fail to instantiate with no Game', () => {
    expect(() => new BracketMatch()).toThrowError();
  });

  it('should fail to instantiate with zero Players', () => {
    expect(() => new BracketMatch(dummyGame)).toThrowError();
  });

  it('should resolve to the sole Player if there is only one', () => {
    let bracketMatch = new BracketMatch(dummyGame, dummyPlayer);
    expect(bracketMatch.resolve()).toBe(dummyPlayer);
  });

  it('should resolve to Player One if that player wins the Match', () => {
    let gameWherePlayer1AlwaysWins = {
      onRoundStart(rules, endRound) { endRound(new RoundResult(PlayOutcome.PLAYER_1)); }
    };
    let player1 = { name: 'one' },
        player2 = { name: 'two' };
    let bracketMatch = new BracketMatch(gameWherePlayer1AlwaysWins, player1, player2);

    expect(bracketMatch.resolve()).toBe(player1);
  });

  it('should resolve to Player Two if that player wins the Match', () => {
    let gameWherePlayer2AlwaysWins = {
      onRoundStart(rules, endRound) { endRound(new RoundResult(PlayOutcome.PLAYER_2)); }
    };
    let player1 = { name: 'one' },
        player2 = { name: 'two' };
    let bracketMatch = new BracketMatch(gameWherePlayer2AlwaysWins, player1, player2);

    expect(bracketMatch.resolve()).toBe(player2);
  });

  it('should throw an error if neither player wins the Match', () => {
    let game = {},
      player1 = { name: 'one' },
      player2 = { name: 'two' },
      bracketMatch = new BracketMatch(game, player1, player2);

    expect(() => bracketMatch.resolve()).toThrowError();
  });
});

describe('Bracket', () => {
  let dummyGame = {};

  it('should fail to instantiate with zero Players', () => {
    expect(() => new Bracket(dummyGame)).toThrowError();
  });
});

describe('Tournament', () => {
  let dummyGame = {};

  it('should fail to instantiate with no Game specified', () => {
    expect(() => new Tournament()).toThrowError();
  });

  it('should be instantiable with a Game', () => {
    expect(new Tournament(dummyGame)).toBeDefined();    
  });

  describe('adding Players', () => {
    it('should work', () => {
      let tourney = new Tournament(dummyGame);
      tourney.addPlayer({});

      expect(tourney.players).toBeDefined();
      expect(tourney.players.length).toEqual(1);
    });
  });
});
