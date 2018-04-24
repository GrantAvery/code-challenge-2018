describe('Simple Code Clash Player', () => {
  it('should be instantiable', () => {
    let player = new SimpleCodeClashPlayer();
    expect(player).toBeDefined();
  });

  describe('onPlayTurn', () => {
    it('should build attacker', () => {
      let player = new SimpleCodeClashPlayer();
      let choice = player.playTurn();
      expect(choice).toBeDefined();
    });
  });

});
