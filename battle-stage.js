import { Match } from './framework/framework.js';
import { GameOfDrones } from './game/game-of-drones.js';

import AdaptiveDefender from './example-bots/adaptive-defender.js';
import ZergRusher from './example-bots/zerg-rush.js';
import HardHittingPacifist from './example-bots/hard-hitting-pacifist.js';
import Randomonium from './example-bots/random-choices.js';

let match = new Match({
  game: new GameOfDrones({ rounds: 1000 }),
  player1: Randomonium(),
  player2: ZergRusher()
});

console.log(JSON.stringify(match.play(), null, 2));
