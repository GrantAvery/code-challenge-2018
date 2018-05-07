import { Match, Round, RoundStatus } from './framework.js';

describe('Round', () => {
  it('should be instantiable', () => {
    let round = new Round();
    expect(round).toBeDefined();
  });

  describe('initial state', () => {
    it('should have a default turn count', () => {
      expect(new Round().turns).toBeDefined();
    });

    it('should have a configurable turn count', () => {
      expect(new Round({ turns: 3 }).turns).toBe(3);
    });

    it('should decide turn count based on game, then config, then defaults', () => {
      let game = { getRoundRules() { return { turns: 10 }}};
      expect(new Round({ game, turns: 5 }).turns).toBe(10);
      expect(new Round({ turns: 5 }).turns).toBe(5);
      expect(new Round().turns).toBe(2);
    });

    it('should have an initial status of "NEW"', () => {
      expect(new Round().status).toBe(RoundStatus.NEW);
    });
  });

  describe('start', () => {
    it('should set the status to "IN_PROGRESS"', () => {
      expect(new Round().start().status).toBe(RoundStatus.IN_PROGRESS);
    });

    it('should have a turns remaining equal to turn count', () => {
      expect(new Round({ turns: 5 }).start().turnsRemaining).toBe(5);
    })

    it('should notify game and players that round is starting', () => {
      let game = jasmine.createSpyObj('game', ['onRoundStart']),
        player1 = jasmine.createSpyObj('player', ['onRoundStart']),
        player2 = jasmine.createSpyObj('player', ['onRoundStart']);

      new Round({ game, player1, player2 }).start();

      expect(game.onRoundStart).toHaveBeenCalled();
      expect(player1.onRoundStart).toHaveBeenCalled();
      expect(player2.onRoundStart).toHaveBeenCalled();
    });

    it('should combine basic and game-specific Round rules to inform players', () => {
      let game = { getRoundRules() { return { fancyRule: 'win' } } },
        player1 = jasmine.createSpyObj('player1', ['onRoundStart']),
        player2 = jasmine.createSpyObj('player2', ['onRoundStart']),
        gameGetRoundRules = spyOn(game, 'getRoundRules').and.callThrough();

      new Round({ game, player1, player2, turns: 1 }).start();

      expect(gameGetRoundRules).toHaveBeenCalled();
      expect(player1.onRoundStart).toHaveBeenCalledWith({ turns: 1, fancyRule: 'win' });
      expect(player2.onRoundStart).toHaveBeenCalledWith({ turns: 1, fancyRule: 'win' });
    });
  });

  describe('turn execution', () => {
    it('should fail if the round is not yet started', () => {
      let round = new Round();
      expect(() => { round.executeTurn() }).toThrow();
    });

    it('should fail if the round is already FINISHED', () => {
      let round = new Round();
      round.status = RoundStatus.FINISHED;

      expect(() => { round.executeTurn() }).toThrow();
    });

    it('should decrement the remaining turns', () => {
      let round = new Round({ turns: 5 });

      round.start()
        .executeTurn()
        .executeTurn();

      expect(round.turnsRemaining).toBe(3);
    });

    it('should solicit actions from players as constants and provide them to the game', () => {
      let player1 = { playTurn() { return 1 } },
        player2 = { playTurn() { return 2 } },
        game = jasmine.createSpyObj('game', ['playTurn']),
        player1PlayTurn = spyOn(player1, 'playTurn').and.callThrough(),
        player2PlayTurn = spyOn(player2, 'playTurn').and.callThrough();

      new Round({ game, player1, player2 })
        .start()
        .executeTurn();

      expect(player1PlayTurn).toHaveBeenCalled();
      expect(player2PlayTurn).toHaveBeenCalled();
      expect(game.playTurn).toHaveBeenCalledWith(1, 2);
    });

    xit('should solicit actions from players as Promises and provide the resolved values to the game', () => {
      /* Ignored for now, but should handle this later! May require some API changes...
      let player1 = { playTurn() { return Promise.resolve(1) }},
          player2 = { playTurn() { return Promise.resolve(2) }},
          game = { }
          game = new DummyGame(),
          player1PlayTurn = spyOn(player1, 'playTurn').and.callThrough(),
          player2PlayTurn = spyOn(player2, 'playTurn').and.callThrough(),
          gamePlayTurn = spyOn(game, 'playTurn');

      new Round({ game, player1, player2 }).start().executeTurn();

      expect(player1PlayTurn).toHaveBeenCalled();
      expect(player2PlayTurn).toHaveBeenCalled();
      expect(gamePlayTurn).toHaveBeenCalledWith(1, 2);
      */
    });

    it('should notify the game when the round runs out of turns', () => {
      let game = jasmine.createSpyObj('game', ['onNoRemainingTurnsInRound']);

      new Round({ game, turns: 1 })
        .start()
        .executeTurn();

      expect(game.onNoRemainingTurnsInRound).toHaveBeenCalled();
    });

    it('should end the round after the last turn', () => {
      let round = new Round({ turns: 1 });
      let end = spyOn(round, 'end');

      round.start()
        .executeTurn();

      expect(round.turnsRemaining).toBe(0);
      expect(end).toHaveBeenCalled();
    });
  });

  describe('end', () => {
    it('should set the status to "FINISHED"', () => {
      expect(new Round().start().end().status).toBe(RoundStatus.FINISHED);
    });

    it('should notify the players that the round has ended', () => {
      let player1 = jasmine.createSpyObj('player1', ['onRoundEnd']),
        player2 = jasmine.createSpyObj('player2', ['onRoundEnd']),
        game = {};

      new Round({ game, player1, player2 })
        .start()
        .end();

      expect(player1.onRoundEnd).toHaveBeenCalled();
      expect(player2.onRoundEnd).toHaveBeenCalled();
    });

    it('should notify the players of the results of the round when it ends', () => {
      let player1 = jasmine.createSpyObj('player1', ['onRoundEnd']),
          player2 = jasmine.createSpyObj('player2', ['onRoundEnd']),
          player1Result = { outcome: 'WIN' },
          player2Result = { outcome: 'LOSE' },
          game = {
            getPlayer1RoundResult() { return player1Result },
            getPlayer2RoundResult() { return player2Result }
          };

      new Round({ game, player1, player2 })
        .start()
        .end();

      expect(player1.onRoundEnd).toHaveBeenCalledWith(player1Result);
      expect(player2.onRoundEnd).toHaveBeenCalledWith(player2Result);
    });
  });

  describe('play', () => {
    it('should execute the full lifecycle of the round', () => {
      let turns = 3,
        round = new Round({ turns }),
        roundStart = spyOn(round, 'start').and.callThrough(),
        roundExecuteTurn = spyOn(round, 'executeTurn').and.callThrough(),
        roundEnd = spyOn(round, 'end').and.callThrough();

      round.play();

      expect(roundStart).toHaveBeenCalledBefore(roundExecuteTurn);
      expect(roundExecuteTurn).toHaveBeenCalledBefore(roundEnd);
      expect(roundExecuteTurn).toHaveBeenCalledTimes(turns);
      expect(roundEnd).toHaveBeenCalled();
    });
  });
});

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
