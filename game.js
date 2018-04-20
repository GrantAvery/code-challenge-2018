class Round {
    constructor(turns) {
        this.status = 'NEW';
        this.turns = turns || 10;
        this.turnsRemaining = turns;
    }

    executeTurn(player1Actions, player2Actions) {
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

    playTurn(gameState) {
        return {
            createWorkers: 0,
            createSoldiers: 0,
            launchAttack: false
        }
    }

    onRoundEnd(outcome) {
    }
}