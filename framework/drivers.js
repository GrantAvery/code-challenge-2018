class GameDriver {
  constructor(game) { this.meta = 'GameDriver'; this.game = game; }
  getMatchRules() { return callIfExists(this.game, 'getMatchRules', arguments); }
  onMatchStart() { callIfExists(this.game, 'onMatchStart', arguments); }
  getRoundRules() { return callIfExists(this.game, 'getRoundRules', arguments); }
  onRoundStart() { callIfExists(this.game, 'onRoundStart', arguments); }
  getPlayer1TurnState() { return callIfExists(this.game, 'getPlayer1TurnState', arguments); }
  getPlayer2TurnState() { return callIfExists(this.game, 'getPlayer2TurnState', arguments); }
  playTurn() { return callIfExists(this.game, 'playTurn', arguments); }
  onNoRemainingTurnsInRound() { return callIfExists(this.game, 'onNoRemainingTurnsInRound', arguments); }
  getPlayer1RoundResult() { return callIfExists(this.game, 'getPlayer1RoundResult', arguments); }
  getPlayer2RoundResult() { return callIfExists(this.game, 'getPlayer2RoundResult', arguments); }
  onRoundEnd() { return callIfExists(this.game, 'onRoundEnd', arguments); }
}

class PlayerDriver {
  constructor(player) {
    this.player = player;

    this.meta = typeof player.meta == 'object'
      ? player.meta
      : { name: 'Anonymous Player'};
  }
  onMatchStart() { callIfExists(this.player, 'onMatchStart', arguments); }
  onRoundStart() { callIfExists(this.player, 'onRoundStart', arguments); }
  playTurn() { return callIfExists(this.player, 'playTurn', arguments); }
  onRoundEnd() { callIfExists(this.player, 'onRoundEnd', arguments); }
}

function callIfExists(obj, method, ...args) {
  if (obj && typeof obj[method] == 'function')
    return obj[method].apply(obj, ...args);
}

export { GameDriver, PlayerDriver };
