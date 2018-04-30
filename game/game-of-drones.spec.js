import { GameOfDrones, PlayerActions, determineAggressor } from './game-of-drones.js';

let CREATE_PRODUCER = { newProducers: 1 },
    CREATE_SOLDIER = { newSoldiers: 1 },
    ATTACK = { launchAttack: true };


describe('Game of Drones', () => {
  it('should be instantiable', () => {
    let game = new GameOfDrones();
    expect(game).toBeDefined();
  });

  describe('onRoundStart', () => {
    it('should initialize player state', () => {
      let game = new GameOfDrones();
      game.onRoundStart(() => {});

      expect(game.player1).toBeDefined();
      expect(game.player2).toBeDefined();
    });

    it('should provide game a way to signal the end of the round', () => {
      let game = new GameOfDrones();
      let endRound = jasmine.createSpy('endRound');
      game.onRoundStart({}, endRound);
      game.signalEndOfRound();
      expect(endRound).toHaveBeenCalled();
    });
  });

  describe('getting player turn state', () => {
    it('should return the player state', () => {
      let game = new GameOfDrones();
      game.onRoundStart(() => {});
      game.playTurn(CREATE_SOLDIER, CREATE_PRODUCER);

      let p1State = game.getPlayer1TurnState(),
        p2State = game.getPlayer2TurnState();

      expect(p1State.attackers).toEqual(game.player1.attackers);
      expect(p1State.workers).toEqual(game.player1.workers);
      expect(p2State.attackers).toEqual(game.player2.attackers);
      expect(p2State.workers).toEqual(game.player2.workers);
    });
  });

  describe('play turn', () => {
    var game, noop = () => {};

    beforeEach(() => {
      game = new GameOfDrones();
      game.onRoundStart({}, noop);
    });

    it('should keep track of player choices', () => {
      let player1Choice = CREATE_PRODUCER,
          player2Choice = CREATE_SOLDIER;

      game.playTurn(player1Choice, player2Choice);

      expect(game.player1.actions).toContain(player1Choice);
      expect(game.player2.actions).toContain(player2Choice);
    });

    it('should trigger clash if either or both players attack', () => {
      let evaluateClash = spyOn(game, 'evaluateClash');

      game.playTurn({ launchAttack: true }, {});
      game.playTurn({}, { launchAttack: true });
      game.playTurn({ launchAttack: true }, { launchAttack: true });

      expect(evaluateClash).toHaveBeenCalledTimes(3);
    });

    describe('spending', () => {
      it('should not be allowed to exceed the number of producers at the start of the round', () => {
        game.playTurn({ newProducers: 10 }, { newSoldiers: 10 });

        expect(game.getPlayer1TurnState()).toEqual({ producers: 2, soldiers: 0 });
        expect(game.getPlayer2TurnState()).toEqual({ producers: 1, soldiers: 1 });
      });

      it('should give new producers precedence over new soldiers', () => {
        game.player1.producers = 8;
        game.player2.producers = 5;
        game.playTurn({ newProducers: 5, newSoldiers: 5 }, { newProducers: 5, newSoldiers: 5 });

        expect(game.getPlayer1TurnState()).toEqual({ producers: 8 + 5, soldiers: 3 });
        expect(game.getPlayer2TurnState()).toEqual({ producers: 5 + 5, soldiers: 0 });
      });
    });
  });

  describe('clashes', () => {
    let noop = () => {};

    describe('determination of aggressor', () => {
      var game;

      beforeEach(() => {
        game = new GameOfDrones();
        game.onRoundStart({}, noop);
      });

      it('should be player 1 if player 1 attacked but player 2 did not', () => {
        let { player1, player2 } = game;
        game.playTurn(ATTACK, CREATE_PRODUCER);

        expect(determineAggressor(player1, player2)).toBe(player1);
      });

      it('should be player 2 if player 2 attacked but player 1 did not', () => {
        let { player1, player2 } = game;
        game.playTurn(CREATE_SOLDIER, ATTACK);

        expect(determineAggressor(player1, player2)).toBe(player2);
      });

      it('should fail to determine an aggressor if both players attack at once and have equal attackers', () => {
        let { player1, player2 } = game;
        game.playTurn(ATTACK, ATTACK);

        expect(determineAggressor(player1, player2)).toBeNull();
      });
    });

    it("should be won by the aggressor (as Player 1) if they can overcome the defender's advantage", () => {
      let game = new GameOfDrones();
      game.onRoundStart({}, noop);

      let [player1, player2] = [game.player1, game.player2];
      game.playTurn(CREATE_SOLDIER, CREATE_PRODUCER);
      game.playTurn(CREATE_SOLDIER, CREATE_PRODUCER);
      game.playTurn(ATTACK, CREATE_PRODUCER);

      expect(determineAggressor(player1, player2)).toBe(player1);
      expect(game.evaluateClash()).toBe(player1);
    });

    it("should be won by the aggressor (as Player 2) if they can overcome the defender's advantage", () => {
      let game = new GameOfDrones();
      game.onRoundStart({}, noop);

      let [player1, player2] = [game.player1, game.player2];
      game.playTurn(CREATE_PRODUCER, CREATE_SOLDIER);
      game.playTurn(CREATE_PRODUCER, CREATE_SOLDIER);
      game.playTurn(CREATE_PRODUCER, ATTACK);

      expect(determineAggressor(player1, player2)).toBe(player2);
      expect(game.evaluateClash()).toBe(player2);
    });

    it('should be won by the defender if they have greater attack power than the aggressor (including defenders advantage)', () => {
      let game = new GameOfDrones();
      game.onRoundStart({}, noop);

      let [player1, player2] = [game.player1, game.player2];
      game.playTurn(CREATE_PRODUCER, CREATE_SOLDIER);
      game.playTurn(ATTACK, CREATE_SOLDIER);

      expect(determineAggressor(player1, player2)).toBe(player1);
      expect(game.evaluateClash()).toBe(player2);
    });

    it('should be won by the defender if they have equal attack power as the aggressor (including defenders advantage)', () => {
      let game = new GameOfDrones();
      game.onRoundStart({}, noop);

      let [player1, player2] = [game.player1, game.player2];
      game.playTurn(CREATE_SOLDIER, CREATE_PRODUCER);
      game.playTurn(ATTACK, CREATE_PRODUCER);

      expect(determineAggressor(player1, player2)).toBe(player1);
      expect(game.evaluateClash()).toBe(player2);
    });

    it('should result in a draw if no aggressor can be determined and the attacker counts match', () => {
      let [game1, game2] = [new GameOfDrones(), new GameOfDrones()];
      game1.onRoundStart({}, noop);
      game2.onRoundStart({}, noop);

      let [g1p1, g1p2, g2p1, g2p2] = [game1.player1, game1.player2, game2.player1, game2.player2];
      game1.playTurn(ATTACK, ATTACK);
      game2.playTurn(CREATE_SOLDIER, CREATE_SOLDIER);
      game2.playTurn(ATTACK, ATTACK);

      expect(determineAggressor(g1p1, g1p2)).toBeNull();
      expect(game1.evaluateClash()).toBeNull();

      expect(determineAggressor(g2p1, g2p2)).toBeNull();
      expect(game2.evaluateClash()).toBeNull();
    });

    it('should trigger the end of the Round', () => {
      let game = new GameOfDrones();
      let endRound = jasmine.createSpy('endRound');
      game.onRoundStart({}, endRound);

      game.triggerClash();

      expect(endRound).toHaveBeenCalled();
    });
  });

  describe('running out of turns in a round', () => {
    it('should result in a clash', () => {
      let game = new GameOfDrones(), noop = () => {};
      let evaluateClash = spyOn(game, 'evaluateClash');
      game.onRoundStart({}, noop);

      game.onNoRemainingTurnsInRound();

      expect(evaluateClash).toHaveBeenCalled();
    });
  });
});
