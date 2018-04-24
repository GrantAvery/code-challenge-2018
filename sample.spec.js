describe('sample test', () => {
    it('gotta start somewhere', () => {

        let game = new SampleGame();
        expect(game).toBeDefined();

        let player1 = new SamplePlayer();
        expect(player1).toBeDefined();

        let player2 = new SamplePlayer();
        expect(player2).toBeDefined();

        let round = new Round({ game, player1, player2 }).start();
        expect(round).toBeDefined();

    });
});
