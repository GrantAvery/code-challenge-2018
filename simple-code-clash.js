class SimpleCodeClash {
  constructor() {
  }

  onRoundStart(endRound) {
    this.player1 = new PlayerState();
    this.player2 = new PlayerState();
    this.endRound = endRound;
  }

  playTurn(player1Choice, player2Choice) {
    this.handlePlayerChoice(this.player1, player1Choice);
    this.handlePlayerChoice(this.player2, player2Choice);

    if (this.isAnyPlayerAttacking()) {
        this.triggerClash();
    }
  }

  getPlayer1TurnState() {
    return Object.assign({}, this.player1);
  }

  getPlayer2TurnState() {
    return Object.assign({}, this.player2);
  }

  handlePlayerChoice(player, choice) {
    switch (choice) {
      case 'TRAIN_ATTACKER':
        player.attackers++;
        player.choices.push('TRAIN_ATTACKER');
        break;
      case 'BUILD_DEFENSE':
        player.defenders++;
        player.choices.push('BUILD_DEFENSE');
        break;
      case 'ATTACK':
        player.choices.push('ATTACK');
        break;
      default:
        player.choices.push('INVALID');
    }
    return player.choices[player.choices.length - 1];
  }

  isAnyPlayerAttacking() {
    return this.isPlayerAttacking(this.player1)
      || this.isPlayerAttacking(this.player2);
  }

  isPlayerAttacking(player) {
    return player.choices[player.choices.length - 1] == 'ATTACK';
  }

  triggerClash() {
    this.endRound(this.evaluateClash());
  }

  evaluateClash() {
    let aggressor = this.determineAggressor(this.player1, this.player2);

    if (!aggressor) {
      if (this.player1.defenders == this.player2.defenders) {
        return null;
      } else {
        return this.player1.defenders > this.player2.defenders ? this.player1 : this.player2;
      }
    }

    let defender = this.player1 === aggressor ? this.player2 : this.player1;
    if (aggressor.attackers > defender.defenders) {
      return aggressor;
    } else {
      return defender;
    }
  }

  determineAggressor(player1, player2) {
    let isPlayer1Attacking = this.isPlayerAttacking(player1),
      isPlayer2Attacking = this.isPlayerAttacking(player2);

    let playerWithMostAttackers = (player1, player2) => {
      if (player1.attackers == player2.attackers) {
        return null;
      } else {
        return player1.attackers > player2.attackers ? player1 : player2;
      }
    };

    if (isPlayer1Attacking && isPlayer2Attacking) {
      return playerWithMostAttackers(player1, player2);
    } else {
      return isPlayer1Attacking ? player1 : player2;
    }
  }

  onNoRemainingTurnsInRound() {
    this.triggerClash();
  }
}

//     onMatchStart() {}

//     getMatchRules() {}

//     getRoundRules() {}

//     getPlayer1TurnState() {
//         return Object.assign({}, this.player1);
//     }

//     getPlayer2TurnState() {
//         return Object.assign({}, this.player2);
//     }




//     onNoMoreTurnsInRound() {}

//     onRoundEnd() {}

//     getRoundResults() {}
// }

class PlayerState {
  constructor() {
    this.attackers = 1;
    this.defenders = 0;
    this.choices = [];
  }
}
