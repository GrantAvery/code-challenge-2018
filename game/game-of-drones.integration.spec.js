import { Match, PlayOutcome } from '../framework/framework.js';
import { GameOfDrones } from './game-of-drones.js';

describe('GameOfDrones integration tests: ', () => {
  let hyperGreedyBot = {
    playTurn(state) {
      return { newProducers: state.producers };
    }
  };

  let tragicallyAggressiveBot = {
    playTurn(state) {
      return { newSoldiers: state.producers, launchAttack: true }
    }
  };

  let timingAttackBot = (function() {
    let turnsToWaitBeforeAttacking;
    return {
      onRoundStart() {
        turnsToWaitBeforeAttacking = 3;
      },
      playTurn(state) {
        let isTimeUp = --turnsToWaitBeforeAttacking <= 0;
        return {
          newProducers: isTimeUp ? 0 : state.producers,
          newSoldiers: isTimeUp ? state.producers : 0,
          launchAttack: isTimeUp
        };
      }
    }
  })();

  describe('HyperGreedyBot', () => {
    it('should manage to win against TragicallyAggressiveBot', () => {
      let match = new Match({
        game: new GameOfDrones(),
        player1: hyperGreedyBot,
        player2: tragicallyAggressiveBot
      });

      expect(match.play().outcome).toBe(PlayOutcome.PLAYER_1);
    });

    it('should not be so lucky against TimingAttackBot', () => {
      let match = new Match({
        game: new GameOfDrones(),
        player1: hyperGreedyBot,
        player2: timingAttackBot
      });

      let result = match.play();

      expect(match.play().outcome).toBe(PlayOutcome.PLAYER_2);
    });

    it('should of course draw against itself', () => {
      let match = new Match({
        game: new GameOfDrones(),
        player1: hyperGreedyBot,
        player2: hyperGreedyBot
      });

      let result = match.play();

      expect(match.play().outcome).toBe(PlayOutcome.DRAW);
    });
  });

  describe('TragicallyAggressiveBot', () => {
    it('should also lose against TimingAttackBot', () => {
      let match = new Match({
        game: new GameOfDrones(),
        player1: tragicallyAggressiveBot,
        player2: timingAttackBot
      });

      let result = match.play();

      expect(match.play().outcome).toBe(PlayOutcome.PLAYER_2);
    });
  });
});
