import { PlayerActions } from "../game/simple-code-clash";

// TODO: Should we import these and use them?
// import { PlayOutcome, RoundResult } from '../framework/framework.js';

class Player {

	constructor() {
    // TODO: Maybe we should keep track of turn number?  Perhaps previous round results?
	};
	
	onMatchStart() {
	};
	
	onRoundStart() {
		
	};
	
	playTurn() {

	  // TODO: figure out what we want to return
    //return PlayerActions.TRAIN_ATTACKER;
    //return PlayerActions.BUILD_DEFENSE;

		return PlayerActions.ATTACK;
	}
	
	onRoundEnd() {
		
	};
	
}

export { Player };
