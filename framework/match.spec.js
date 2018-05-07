import { Match } from './match.js';

describe('Match', () => {
  it('should be instantiable', () => {
    let match = new Match();
    expect(match).toBeDefined();
  });

  describe('initial state', () => {
    it('should have default round count', () => {
      expect(new Match().rounds).toBeDefined();
    });
  });

  describe('start', () => {
    it('should notify players that match is starting', () => {
      let game = jasmine.createSpyObj('game', ['onMatchStart']),
        player1 = jasmine.createSpyObj('player1', ['onMatchStart']),
        player2 = jasmine.createSpyObj('player2', ['onMatchStart']);

      new Match({ game, player1, player2 }).start();

      expect(game.onMatchStart).toHaveBeenCalled();
      expect(player1.onMatchStart).toHaveBeenCalled();
      expect(player2.onMatchStart).toHaveBeenCalled();
    });

    it('should notify players of Match Rules', () => {
      let game = { getMatchRules() { return { fancyRule: 'win' } } },
        player1 = jasmine.createSpyObj('player1', ['onMatchStart']),
        player2 = jasmine.createSpyObj('player2', ['onMatchStart']),
        gameGetMatchRules = spyOn(game, 'getMatchRules').and.callThrough();

      new Match({ game, player1, player2, rounds: 1 }).start();

      expect(gameGetMatchRules).toHaveBeenCalled();
      expect(player1.onMatchStart).toHaveBeenCalledWith({ rounds: 1, drawAllowed: true, fancyRule: 'win' });
      expect(player2.onMatchStart).toHaveBeenCalledWith({ rounds: 1, drawAllowed: true, fancyRule: 'win' });
    });
  });

  describe('execute round', () => {
    it('should produce a round result', () => {
      let game = {},
        player1 = {},
        player2 = {};

      let match = new Match({ game, player1, player2 })
        .start()
        .executeRound();

      expect(match.roundResults).toBeDefined();
      expect(match.roundResults.length).toBe(1);
    });

    xit('should produce an ERROR round result if the game throws an error during play of the round', () => {
      // TODO
    });
  });

  describe('play', () => {
    it('should execute the full lifecycle of the Match (including Rounds)', () => {
      let game = jasmine.createSpyObj('game', [
        'onMatchStart',
        'getMatchRules',
        'onRoundStart',
        'getRoundRules',
        'getPlayer1TurnState',
        'getPlayer2TurnState',
        'playTurn',
        'onNoRemainingTurnsInRound',
        'getPlayer1RoundResult',
        'getPlayer2RoundResult',
        'onRoundEnd',
        'onMatchEnd'
      ]);
      let rounds = 3;

      let match = new Match({ game, rounds }).play();

      expect(game.onMatchStart).toHaveBeenCalledTimes(1);
      expect(game.getMatchRules).toHaveBeenCalledTimes(1);

      expect(game.onRoundStart).toHaveBeenCalledTimes(rounds);
      expect(game.getRoundRules).toHaveBeenCalledTimes(rounds);

      expect(game.getPlayer1TurnState).toHaveBeenCalledTimes(rounds * 2);
      expect(game.getPlayer2TurnState).toHaveBeenCalledTimes(rounds * 2);
      expect(game.playTurn).toHaveBeenCalledTimes(rounds * 2);

      expect(game.onNoRemainingTurnsInRound).toHaveBeenCalledTimes(rounds);
      expect(game.getPlayer1RoundResult).toHaveBeenCalledTimes(rounds);
      expect(game.getPlayer2RoundResult).toHaveBeenCalledTimes(rounds);
    });
  });

  describe('draw game policy', () => {
    it('should default to allowing draws', () => {
      expect(new Match().rules.drawAllowed).toBe(true);
    });

    it('should be configurable to disallow draws', () => {
      expect(new Match({ drawAllowed: false }).rules.drawAllowed).toBe(false);
    });

    it('should decide a winner by random chance if draws are disallowed', () => {
      let result = new Match({ drawAllowed: false }).play();
      expect(result.outcome).not.toBe('DRAW');
      expect(result.outcomeDecidedByRandomChance).toBe(true);
    });
  });

});
