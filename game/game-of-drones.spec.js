import { GameOfDrones, PlayerActions, determineAggressor } from './game-of-drones.js';

let { TRAIN_ATTACKER, BUILD_WORKER, ATTACK } = PlayerActions;

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
      game.playTurn(TRAIN_ATTACKER, BUILD_WORKER);

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
      let player1Choice = TRAIN_ATTACKER,
        player2Choice = BUILD_WORKER;

      game.playTurn(player1Choice, player2Choice);

      expect(game.player1.choices).toContain(player1Choice);
      expect(game.player2.choices).toContain(player2Choice);
    });

    it('should allow only recognized player choices, else "INVALID_ACTION"', () => {
      game.playTurn(TRAIN_ATTACKER, TRAIN_ATTACKER);
      game.playTurn(BUILD_WORKER, BUILD_WORKER);
      game.playTurn(ATTACK, ATTACK);
      game.playTurn('WHATEVER', 'STUFF');

      let expected = [TRAIN_ATTACKER, BUILD_WORKER, ATTACK, 'INVALID_ACTION'];

      expect(game.player1.choices).toEqual(expected);
      expect(game.player2.choices).toEqual(expected);
    });

    it('should trigger clash if either or both players attack', () => {
      let evaluateClash = spyOn(game, 'evaluateClash');

      game.playTurn(ATTACK, BUILD_WORKER);
      game.playTurn(TRAIN_ATTACKER, ATTACK);
      game.playTurn(ATTACK, ATTACK);

      expect(evaluateClash).toHaveBeenCalledTimes(3);
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
        game.playTurn(ATTACK, BUILD_WORKER);

        expect(determineAggressor(player1, player2)).toBe(player1);
      });

      it('should be player 2 if player 2 attacked but player 1 did not', () => {
        let { player1, player2 } = game;
        game.playTurn(TRAIN_ATTACKER, ATTACK);

        expect(determineAggressor(player1, player2)).toBe(player2);
      });

      it('should be player 1 if both players attacked, but player 1 has more attackers', () => {
        let { player1, player2 } = game;
        game.playTurn(TRAIN_ATTACKER, BUILD_WORKER);
        game.playTurn(ATTACK, ATTACK);

        expect(determineAggressor(player1, player2)).toBe(player1);
      });

      it('should be player 2 if both players attacked, but player 2 has more attackers', () => {
        let { player1, player2 } = game;
        game.playTurn(BUILD_WORKER, TRAIN_ATTACKER);
        game.playTurn(ATTACK, ATTACK);

        expect(determineAggressor(player1, player2)).toBe(player2);
      });

      it('should fail to determine an aggressor if both players attack at once and have equal attackers', () => {
        let { player1, player2 } = game;
        game.playTurn(ATTACK, ATTACK);

        expect(determineAggressor(player1, player2)).toBeNull();
      });
    });

    it('should be won by the aggressor if they have more attackers than the other player', () => {
      let [game1, game2] = [new GameOfDrones(), new GameOfDrones()];
      game1.onRoundStart({}, noop);
      game2.onRoundStart({}, noop);

      let [g1p1, g1p2, g2p1, g2p2] = [game1.player1, game1.player2, game2.player1, game2.player2];
      game1.playTurn(ATTACK, TRAIN_ATTACKER);
      game2.playTurn(TRAIN_ATTACKER, ATTACK);

      expect(determineAggressor(g1p1, g1p2)).toBe(g1p1);
      expect(game1.evaluateClash()).toBe(g1p2);

      expect(determineAggressor(g2p1, g2p2)).toBe(g2p2);
      expect(game2.evaluateClash()).toBe(g2p1);
    });

    it('should be won by the defender if they have equal or more attackers than the aggressor has attackers', () => {
      let [game1, game2] = [new GameOfDrones(), new GameOfDrones()];
      game1.onRoundStart({}, noop);
      game2.onRoundStart({}, noop);

      let [g1p1, g1p2, g2p1, g2p2] = [game1.player1, game1.player2, game2.player1, game2.player2];
      game1.playTurn(ATTACK, BUILD_WORKER);
      game2.playTurn(BUILD_WORKER, ATTACK);

      expect(determineAggressor(g1p1, g1p2)).toBe(g1p1);
      expect(game1.evaluateClash()).toBe(g1p2);

      expect(determineAggressor(g2p1, g2p2)).toBe(g2p2);
      expect(game2.evaluateClash()).toBe(g2p1);
    });

    it('should result in a draw if no aggressor can be determined and the attacker counts match', () => {
      let [game1, game2] = [new GameOfDrones(), new GameOfDrones()];
      game1.onRoundStart({}, noop);
      game2.onRoundStart({}, noop);

      let [g1p1, g1p2, g2p1, g2p2] = [game1.player1, game1.player2, game2.player1, game2.player2];
      game1.playTurn(ATTACK, ATTACK);
      game2.playTurn(TRAIN_ATTACKER, TRAIN_ATTACKER);
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
