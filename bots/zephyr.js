function zephyrBot () {
  let currentTurn = null
  let matchRules = null
  let maxturns = null
  let attackturn = null
  let rounds = null
  let currentRound = null
  let lastblockcount = null
  let turnstatic = true
  let increment = null
  let roundsum = null
  let roundcount = null
  let countdraw = null
  let countwin = null
  let countlose = null
  let drawattack = false
  let adaptiveattack = false
  let randomattack = false
  let strategy = 'win'
  let lastturn = null
  let thisturn = null

  /**
   * OPTIONAL method / lifecycle hook.
   * Called by the framework to notify Player the start of the Match, providing the rules for the Match
   *
   * Parameters:
   *   matchRules - { rounds: <numberOfRoundsInMatch> }
   */
  function onMatchStart (matchRules) {
    currentRound = 0
    countdraw = 0
    countwin = 0
    countlose = 0
    roundcount = 1
    roundsum = 0
    attackturn = 0
    lastblockcount = 0
    lastturn = 0
    thisturn = 0
    increment = 0
  }

  /**
   * OPTIONAL method / lifecycle hook.
   * Called by the framework to notify Player of the start of a Round, providing the rules for the Round
   *
   * Parameters:
   *   roundRules - {
   *     turns: <maxNumberOfTurnsInRound>,
   *     defenderBonus: <amountOfBonusAttackPowerWhenDefending>
   *   }
   */
  function onRoundStart (roundRules) {
    maxturns = roundRules.turns
    if (lastblockcount == 0) {
      attackturn = maxturns
    }
    // console.log('roundRules = ', JSON.stringify(roundRules))
    // console.log('turns = ', maxturns)
    // console.log('currentRound = ', currentRound)
    currentTurn = 0
  }

  /**
   * REQUIRED method!
   * Called by the framework to solicit the Player's actions each turn, providing the Player's current state.
   * This is the only mechanism by which the Player is able to communicate with the Game.
   *
   * Parameters:
   *   playerState - {
   *     producers: <currentProducerCount>,
   *     soldiers: <currentSoldierCount>
   *   }
   *
   * Expected Return Value: PlayerActions
   *   {
   *     newProducers: <numberOfNewProducersToProduce>,
   *     newSoldiers: <numberOfNewSoldiersToProduce>,
   *     launchAttack: <true | false -- set to true to launch attack with your soldiers at end of turn>
   *   }
   */
  function playTurn (playerState) {
    currentTurn++
    // console.log('playerState = ', JSON.stringify(playerState))
    // console.log('currentTurn = ', currentTurn)

    var producers = 1
    var soldiers = 1
    var attack = false

    if (currentTurn < attackturn) {
      producers = playerState.producers * 2
      soldiers = 0
    } else {
      producers = 0
      soldiers = playerState.producers

      if (drawattack) {
        attack = true
      }
      if (adaptiveattack) {
        attack = true
      }
      if (randomattack) {
        attack = true
      }
    }

    // console.log('producers = ', producers)
    // console.log('soldiers = ', soldiers)
    // console.log('attack = ', attack)

    return {
      newProducers: producers,
      newSoldiers: soldiers,
      launchAttack: attack
    }
  }

  /**
   * OPTIONAL method.
   * Called by the framework to notify Player of the end of a Round, providing the results of the round.
   *
   * Parameters:
   *   roundResult - {
   *     outcome: <'WIN' | 'LOSS' | 'DRAW'>,
   *     turnsPlayed: <numberOfTurnsPlayedInRound>,
   *     you: {
   *       producers: <yourProducerCountAtEndOfRound>,
   *       soldiers: <yourSoldierCountAtEndOfRound>,
   *       attackLaunched: <true | false -- true if you launched attack on last turn>
   *     },
   *     them: {
   *       producers: <theirProducerCountAtEndOfRound>,
   *       soldiers: <theirSoldierCountAtEndOfRound>,
   *       attackLaunched: <true | false -- true if they launched attack on last turn>
   *     }
   *   }
   */
  function onRoundEnd (roundResult) {
    // console.log('roundResult = ', JSON.stringify(roundResult))

    if (roundcount <= 5) {
      roundsum = roundsum + roundResult.turnsPlayed
      if (roundResult.outcome == 'WIN') {
        countwin++
      } else if (roundResult.outcome == 'LOSE') {
        countlose++
      } else if (roundResult.outcome == 'DRAW') {
        countdraw++
      }
    }
    if (roundcount == 5) {
      var roundturns = roundsum / 5
      // console.log('roundturns ', attackturn)
      if (roundturns % 1 != 0) {
        if (countwin == 5) {
          // do nothing
        } else if (countwin >= countlose && countwin > countdraw) {
          // do nothing
        } else {
          if (strategy == 'random') {
            if (countwin >= countlose && countwin > countdraw) {
              // do nothing
            } else {
              strategy = 'random2'
            }
          } else {
            strategy = 'random'
          }
        }
      } else {
        // assume round number set
        attackturn = roundturns
        if (lastblockcount == roundturns && lastblockcount > 0) {
          turnstatic = true
          strategy = 'win'
        } else {
          turnstatic = false
        }
        lastblockcount = roundturns
        if (countdraw == 5 && strategy != 'draw') {
          strategy = 'draw'
        } else if (countdraw == 5 && strategy == 'draw') {
          strategy = 'adaptive'
        }
        if (countwin == 1 && countlose == 4 && turnstatic == false) {
          strategy = 'adaptive'
        }
      }
      roundcount = 0
      roundsum = 0
      countwin = 0
      countlose = 0
      countdraw = 0
    }
    if (strategy == 'draw') {
      drawattack = true
      attackturn = maxturns - 1
    } else {
      drawattack = false
    }
    if (strategy == 'adaptive') {
      attackturn = roundResult.turnsPlayed - 1
      if (attackturn <= 0) {
        attackturn = 10
      }
      adaptiveattack = true
    } else {
      adaptiveattack = false
    }
    if (strategy == 'random') {
      if (turnstatic) {
        attackturn = Math.floor(Math.random() * (lastblockcount - 1) + 1)
      } else {
        attackturn = Math.floor(Math.random() * (maxturns - 1) + 1)
      }
      randomattack = true
    } else {
      randomattack = false
    }
    roundcount++

    // console.log('attack on turn ', attackturn)
    // console.log('strategy ', strategy)
  }

  // Finally, return your Player object here. Don't forget to set metadata :-)
  return {
    meta: {
      name: 'Zephyr V',
      author: 'Chris Reader'
    },
    onMatchStart, // Optional
    onRoundStart, // Optional
    playTurn,
    onRoundEnd // Optional
  }
}

export default zephyrBot
