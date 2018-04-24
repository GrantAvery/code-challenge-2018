class SamplePlayer {

    onMatchStart(args) {
        console.log("SP-OMS: " + args);
    }

    onRoundStart(args) {
        console.log("SP-ORS: " + args);
    }

    playTurn(args) {
        console.log("SP-PT: " + args);
        return "A";
    }

    onRoundEnd(args) {
        console.log("SP-ORE: " + args);
    }

}

class SampleGame {

    onMatchStart(args) {
        console.log("SG-OMS: " + args);
    }

    getMatchRules(args) {
        console.log("SG-GMR: " + args);
    }

    onRoundStart(args) {
        console.log("SG-ORS: " + args);
    }

    getRoundRules(args) {
        console.log("SG-GRR: " + args);
    }

    getPlayer1TurnState(args) {
        console.log("SG-GP1TS: " + args);
    }

    getPlayer2TurnState(args) {
        console.log("SG-GP2TS: " + args);
    }

    playTurn(args) {
        console.log("SG-PT: " + args);
    }

    onNoMoreTurnsInRound(args) {
        console.log("SG-ONMTIR: " + args);
    }

    onRoundEnd(args) {
        console.log("SG-ORE: " + args);
    }

    getRoundResults(args) {
        console.log("SG-GRRESULTS: " + args);
    }

}
