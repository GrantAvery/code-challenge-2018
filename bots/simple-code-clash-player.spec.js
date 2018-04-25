import { SimpleCodeClashPlayer } from './simple-code-clash-player.js';

describe('Simple Code Clash Player', () => {
  it('should be instantiable', () => {
    let player = new SimpleCodeClashPlayer();
    expect(player).toBeDefined();
  });

  describe('onPlayTurn', () => {
    it('should build defense then train attacker', () => {
      let player = new SimpleCodeClashPlayer();
      let choice1 = player.playTurn();
      expect(choice1).toEqual('BUILD_DEFENSE');
      let choice2 = player.playTurn();
      expect(choice2).toEqual('TRAIN_ATTACKER');
    });
  });

});
