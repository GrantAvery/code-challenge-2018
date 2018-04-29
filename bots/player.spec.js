import { Player } from './player.js';
import { PlayerActions } from "../game/simple-code-clash.js";

describe('Base Player Class', () => {
  it('should be instantiable', () => {
    let player = new Player();
    expect(player).toBeDefined();
  });

  describe('onPlayTurn', ()=> {
    it('should not do anything', () => {
      let player = new Player();
      let playerAction = player.playTurn();
      expect(playerAction).toEqual(PlayerActions.ATTACK);
    });

  });

});
