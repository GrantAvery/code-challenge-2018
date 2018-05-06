import { Match } from './framework/framework.js';
import { GameOfDrones } from './game/game-of-drones.js';

import Classy from './bot.class.template.js';
import Closurey from './bot.closure.template.js';

let match = new Match({
  game: new GameOfDrones(),
  player1: Classy(),
  player2: Closurey()
});

console.log(match.play());
