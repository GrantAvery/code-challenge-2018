import { Match } from './framework/index.js';
import { GameOfDrones } from './game/game-of-drones.js';

import AdaptiveDefender from './example-bots/adaptive-defender.js';
import ZergRusher from './example-bots/zerg-rush.js';
import HardHittingPacifist from './example-bots/hard-hitting-pacifist.js';
import Randomonium from './example-bots/random-choices.js';
import TJBot from './bots/TJBot.js';
import Bot1 from './bots/bot1.js';
import Bot2 from './bots/bot2.js';
import Bot3 from './bots/bot3.js';
import Bot4 from './bots/bot4.js';
import Bot5 from './bots/bot5.js';
import NamNguyenBot from './bots/NamNguyenBot.js';
import ChanceBot from './bots/ChanceBot.js';

import GrantBot from './bots/GrantBot.js';

let match = new Match({
  game: new GameOfDrones({ rounds: 1000 }),
  player1: GrantBot(),
  player2: ChanceBot()
});

console.log(JSON.stringify(match.play(), null, 2));
