class Round {
    constructor(init) {
        var defaults = { player1: {}, player2: {}, turns: 2 },
            init = Object.assign({}, defaults, init);

        this.player1 = init.player1;
        this.player2 = init.player2;
        this.turns = init.turns;

        this.status = 'NEW';
        this.turnsRemaining = this.turns;
    }

    executeTurn() {
        if (this.status == 'FINISHED')
            throw new Error('Cannot execute turn after round is finished');

        this.status = 'IN_PROGRESS';

        this.turnsRemaining--;

        if (this.turnsRemaining == 0)
            this.executeClash();
    }

    executeClash() {
        this.status = 'FINISHED';
    }
}

class Match {
    constructor(player1, player2, rules) {
        if (!player1 || !player2 || !rules)
            throw new Error("Incomplete match!");

        this.player1 = player1;
        this.player2 = player2;
        this.rules = {
            totalRounds: rules.totalRounds || 5,
            maxTurnsPerRound: rules.maxTurnsPerRound || 10
        };
        this.state = {
            status: 'INITIAL', // INITIAL | 
            currentRound: 0,
            currentTurn: 0
        };
    }

    playTurn() {
        // Solicit actions from both players
        // Validate actions for each player
        // Update player state based on actions
        // Process clash, if needed
    }

}

class DumbPlayer {

    onGameStart(rules) { }

    onRoundStart() { }

    playTurn(gameState) {
        return {
            createWorkers: 0,
            createSoldiers: 0,
            launchAttack: false
        }
    }

    onRoundEnd(outcome) { }
}