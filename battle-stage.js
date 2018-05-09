import { Match } from './framework/index.js';
import { GameOfDrones } from './game/game-of-drones.js';

import AdaptiveDefender from './example-bots/adaptive-defender.js';
import ZergRusher from './example-bots/zerg-rush.js';
import HardHittingPacifist from './example-bots/hard-hitting-pacifist.js';
import Randomonium from './example-bots/random-choices.js';

import PeteMooney from './bots/skynet-v1.js';
import TomJahncke from './bots/tawj.js';
import GrantBot from './bots/GrantBot.js';
import Zephyr from './bots/zephyr.js';
import SniperRush from './bots/sniper-rush.js'
import Drozen from './bots/bot.jarchow.js';

let match = new Match({

  game: new GameOfDrones({ rounds: 1000 }),
  player1: PeteMooney(),
  //player1: TomJahncke(),
  //player1: GrantBot(),
  //player1: Zephyr(),
  //player1: SniperRush(),
  //player1: Drozen(),

  //player2: PeteMooney()
  player2: TomJahncke()
  //player2: GrantBot()
  //player2: Zephyr()
  //player2: SniperRush()
  //player2: Drozen()

  // ==================
  // == EXAMPLE BOTS ==
  // ==================
  //player2: AdaptiveDefender()
  //player2: ZergRusher()
  //player2: HardHittingPacifist()
  //player2: Randomonium()

});

console.log(JSON.stringify(match.play(), null, 2));
