class SniperRusher {

    constructor() {
        this.meta = {
            name: 'SniperRush',
            author: 'Jeff Tromp'
        };
    }

    onRoundStart(roundRules) {
        this.roundRules = roundRules;
        this.currentTurn = 0;
        this.turnToAttack = getRandomInt(3, roundRules.turns / 2); // turns + 1 to enable never attacking
    };

    playTurn(playerState) {
        this.currentTurn++;
        if (this.currentTurn % 5 === 0) {
            return this.random(playerState);
        }
        return this.mine(playerState);
    }

    random(playerState) {
        let productionCapacity = playerState.producers;
        let soldiersToCreate = getRandomInt(0, productionCapacity);
        let producersToCreate = productionCapacity - soldiersToCreate;

        return {
            newProducers: producersToCreate,
            newSoldiers: soldiersToCreate,
            launchAttack: (this.currentTurn >= this.turnToAttack)
        };
    }

    mine(playerState) {
        let soldiersToCreate = 0;
        let producersToCreate = 0;

        if (this.currentTurn === 1) {
            producersToCreate = playerState.producers;
        } else if (this.currentTurn === 2) {
            soldiersToCreate = playerState.producers;
        } else if (this.currentTurn < this.turnToAttack) {
            producersToCreate = playerState.producers;
        } else {
            soldiersToCreate = playerState.producers;
        }

        let attack = this.currentTurn === this.turnToAttack;

        return {
            newProducers: producersToCreate,
            newSoldiers: soldiersToCreate,
            launchAttack: attack
        };
    }

    rush(playerState) {
        let minimumSoldiersNeededToWin = this.roundRules.defenderBonus + 1;
        let soldiersToCreate = playerState.producers;
        let totalSoldiersAtEndOfThisRound = playerState.soldiers + soldiersToCreate;
        let isWinFeasible = totalSoldiersAtEndOfThisRound >= minimumSoldiersNeededToWin;

        return {
            newProducers: 0,
            newSoldiers: soldiersToCreate,
            launchAttack: isWinFeasible
        };
    }

    alternate(playerState) {
        let soldiersToCreate = 0;
        let producersToCreate = 0;
        if (this.currentTurn % 2 === 0) {
            producersToCreate = playerState.producers;
        } else {
            soldiersToCreate = playerState.producers;
        }
        let attack = this.currentTurn === this.turnToAttack;

        return {
            newProducers: producersToCreate,
            newSoldiers: soldiersToCreate,
            launchAttack: attack
        };
    }

}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function player() {
    return new SniperRusher();
}

export default player;
