/**
 * SKYNET v1.0
 * -------------------------------------------
 * This bot's strategy is to [TEXT REDACTED]
 * 
 * It's unstoppable. 
 */
function createSkyNet() {

	// Properties
	let productionCapacity = null;
	let currentRound = 0;
	let currentTurn = null;
	let lastStratagem = null;
	let currentStratagem = null;
	let results = [];
	let totalWins = 0;
	let currentSegment = 0;
	let segmentWins = 0;
	let segmentSize = 5;
	let foeIsAdaptive = false;

	// Logic for the Start of a new round
  function onRoundStart(roundRules) {
		currentRound++;
		currentTurn = 0;
		
		lastStratagem = currentStratagem;
		currentStratagem = determineStratagem(); // determine a strategy for the round

		// Partition the match into segments for analysis
		if (currentRound > 4 && (currentRound - 1) % segmentSize === 0) {
			segmentWins = 0;
			currentSegment++;
		}
  }

	// Play our turn
  function playTurn(playerState) {
		currentTurn++;
		productionCapacity = playerState.producers;
		
		if (currentStratagem === 'RUSH2') { return rushTurn(2); }
		if (currentStratagem === 'RUSH3') { return rushTurn(3); }
		if (currentStratagem === 'RUSH4') { return rushTurn(4); }
		if (currentStratagem === 'RUSH5') { return rushTurn(5); }
		else if (currentStratagem === 'RDA4') { return rda4Turn(); }
		else { return rda4Turn(); }
  }

	// Logic for End of a round
  function onRoundEnd(roundResult) {
		logRoundResult(roundResult);
	}
	
	/* ------------------------------------
	 Expert Systems
	--------------------------------------*/

	function determineStratagem() {
		let strat = '';

		// Watch and learn for first SEGMENTSIZE turns
		if (currentRound <= segmentSize) {
			strat = 'RDA4';
		}

		// Re-evaluate our strategy every SEGMENTSIZE rounds
		else if ((currentRound - 1) % segmentSize === 0) {
			if (segmentWins/segmentSize > 0.5) { strat = currentStratagem; }
			else {
				strat = incrementStratagem();
			}

		}
		else { strat = currentStratagem; }

		// Priority command: switch it up to confuse adaptive AIs
		// We determine this by checking our win ratio after 10 segments
		if (currentSegment === 10 && (totalWins/currentRound) < 0.3) { 
			foeIsAdaptive = true;
		}
		if (foeIsAdaptive) { strat = incrementStratagem(); }

		return strat;
	}

	function incrementStratagem() {
		if (currentStratagem === 'RUSH2') { return 'RUSH3'; }
		if (currentStratagem === 'RUSH3') { return 'RUSH5'; }
		if (currentStratagem === 'RUSH4') { return 'RUSH5'; }
		if (currentStratagem === 'RUSH5') { return 'RDA4'; }
		if (currentStratagem === 'RDA4') { return 'RUSH3'; }
	}

	// Log the results of the round for analysis
	function logRoundResult(roundResult) {
		results.push(roundResult);
		if (roundResult.outcome === 'WIN') {
			totalWins++;
			segmentWins++;
		}

	}



	/* ------------------------------------
	 Strategems
	--------------------------------------*/
	function rda4Turn() {
		if (currentTurn === 1) { return { newProducers: productionCapacity }; }
		if (currentTurn === 2) { return { newProducers: 1, newSoldiers: 1 }; }
		if (currentTurn === 3) { return { newProducers: 1, newSoldiers: 2 }; }
		if (currentTurn === 4) { return { newSoldiers: 4, launchAttack: true }; }
		else return { newSoldiers: productionCapacity };
	}

	function rushTurn(turnToAttack) {
		return (currentTurn < turnToAttack)
      ? { newProducers: productionCapacity }
      : {
				newProducers: 0,
				newSoldiers: productionCapacity,
				launchAttack: true
			};
	}



	/* ------------------------------------
	 Return our Player object
	--------------------------------------*/
  return {
    meta: {
      name: 'SkyNet v1.0',
      author: 'Peter Mooney' // pjmooney[at]gmail[dot]com
    },
    onRoundStart,
    playTurn,
    onRoundEnd
  };
};

function player() {
  return createSkyNet();
}

export default player;
