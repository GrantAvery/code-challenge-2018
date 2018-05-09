import { Match } from './framework/index.js';
import { GameOfDrones } from './game/game-of-drones.js';
import { RoundRobin } from './framework/tournament.js';

import AdaptiveDefender from './example-bots/adaptive-defender.js';
import ZergRusher from './example-bots/zerg-rush.js';
import HardHittingPacifist from './example-bots/hard-hitting-pacifist.js';
import Randomonium from './example-bots/random-choices.js';

import PeteMooney from './bots/skynet-v1.js';
import TomJahncke from './bots/tawj.js';
import GrantBot from './bots/GrantBot.js';
import Zephyr from './bots/zephyr.js';
import SniperRush from './bots/sniper-rush.js'

let game = new GameOfDrones({
  rounds: 1000
});

let tourney = new RoundRobin(game, [
  AdaptiveDefender,
  ZergRusher,
  HardHittingPacifist,
  Randomonium,
  PeteMooney,
  TomJahncke,
  Zephyr,
  SniperRush,
  GrantBot
]);

console.log(JSON.stringify(tourney.play(), null, 2));

