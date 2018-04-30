import { GameOfDronesPlayer } from './game-of-drones-player.js';
import { PlayerActions } from "../game/game-of-drones.js";

describe('Game of Drones Player', () => {
  it('should be instantiable', () => {
    let player = new GameOfDronesPlayer();
    expect(player).toBeDefined();
  });

  describe('onPlayTurn', () => {
    it('should build defense then train attacker', () => {
      let player = new GameOfDronesPlayer();
      let choice1 = player.playTurn();
      expect(choice1).toEqual(PlayerActions.BUILD_WORKER);
      let choice2 = player.playTurn();
      expect(choice2).toEqual(PlayerActions.TRAIN_ATTACKER);
    });
  });

});
