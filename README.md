Code Challenge 2018
===================

Thank you for your interest in Bravo LT's Google I/O Extended Event Code Challenge 2018 (that's a mouthful!)!  This year, instead of solving the Travelling Salesman Problem or getting artistic with your favorite esoteric language, participants will be expected to produce an **AI "bot"** for a simple game!

The game is designed to be simple enough to understand in 5 minutes, but interesting enough that it is entertaining to play and/or watch.

The software is designed to be simple enough where a viable AI bot could be produced in a few minutes, but complex enough to provide a platform for your ingenuity (and overwhelming strategic prowess) to shine through in your AI creation!

As with previous years, there are prizes available for the best entries! To determine which bots will earn those prizes, all the submitted AIs will be going head-to-head against each other in a tournament format. May the best bot win!

The rest of this README consists of an explanation of the game. Please stay tuned for details about how to go about building your AI and how to submit your AI so that it can go head-to-head with AIs written by other participants (including some Bravo LT engineers)!

# How to Participate

## Building Your Bot

Participation in the Code Challenge consists of writing a Javascript `function` or `class` which implements the necessary interface for a game bot. The interface is quite simple, having only a single required function: `playTurn`, which the game calls to solicit actions from each bot once per turn. This function takes a single `playerState` parameter and is expected to return a simple object representing the actions your bot wishes to perform for that turn. You can find more details in the `bot.template.js` file, or by reviewing the example bots in the `example-bots` directory.

A simple (albeit unsophisticated) bot is producible in a matter of minutes.

## Getting Started

1. Checkout the repo

2. Run `npm install`

3. Create your bot (try using one of the templates)

4. Modify `battle-stage.js` to import your bot and pit it against one of the example bots

5. Run `npm run battle` to execute the Match and see your bot in action!

## Submitting Your Bot

After your bot has been created, it should be submitted it to us prior to the Code Challenge Event. There are several available avenues to submit your creation. You could:

* Fork this repository and create a Pull Request (if you are comfortable with your code being publicly visible)

* Add your code to a source repository under your control and send us a link where we can access it

* Add your code to Google Drive, Dropbox, or the like and send us a link where we can access it

* Package up your code in a `.zip` or `.tgz` file and email it to us

Please email submission links or questions to david.schoutens@bravolt.com

## Come Watch the Code Challenge Contest Unfold!

During the Google I/O Extended GR event, we will be organizing a tournament-style showdown to determine the best submissions. There are two time slots we will be dedicating to the Code Challenge this year: **3:00 pm on Tuesday, May 8** and **11:30 am on Wednesday, May 9**.  If the level of interest and number of submissions is high enough, we plan to run a separate tournament on both days during those time slots. Spectators are welcome, and prizes will be awarded for the winning bots!

# Game Description: GameOfDrones

GameOfDrones is a simple, concurrent-turn-based strategy game where players try to amass enough fighting units to overwhelm their enemy in a single decisive battle

## Rules

The game is played between two players.

Play happens in **rounds**, which are turn-based.

Each **turn**, both players decide which actions they wish to take for that turn. Available actions are largely dependent on the **units** the player controls at the start of the turn. Once both players have made their decisions, the actions of both players are evaluated simultaneously, after which the game advances to the next turn.

Players are blind to each others' actions and unit counts.

Play within a round continues until a **clash** occurs, which decides the outcome of the round.

A single **match** consists of multiple rounds. The player which wins a majority of rounds in a match is the winner.

### Units

The following distinct unit types can be under player control:

* **Producers**: Units which grant the player the ability to create an additional unit each turn.

* **Soldiers**: Units which contribute to a player's **attack power**.

### Clashes

When a *clash* occurs, the *attack power* of both players are evaluated, with one player prevailing over the other. Each clash marks the end of a round.

#### Triggers

Clashes are triggered in one of two ways:

  1. One or both players may **initiate** the clash at the end of any turn
  
  2. A clash is **automatically** initiated by both players after a predetermined number of turns elapse without a clash.

#### Attacking and Defending

If one player initiates a clash on a turn, but the other player does not, then the initiating player is said to be **attacking** while the other is said to be **defending**.

Defending players benefit from a "home-base advantage" in the form of a bonus added to their *attack power* which is equivalent to the attack power of a single **Soldier** unit. Furthermore, defending players survive the clash in the case where the attack power of both players is equal.

Attacking players, therefore, must overwhelm their opponent in order to win against a defender. If an attacker fails to win, they lose -- there is no draw.

#### Clashes "In the Field"

If both players initiate a clash on the same turn, their armies are said to battle "in the field".

In this scenario, neither side has an advantage over the other. The victor of the clash is decided as follows:

  1. The player with the higher **attack power** wins the clash.

  2. If both players have equally high attack power, then the player with the **larger number of total units** (including **Producers**) wins.

  3. Finally, if both players have the same attack power and total number of units, the clash is decided by **random chance**.

### Gameplay

At the start of each *round*, each player has a single **Producer** unit.

Each *turn*, the player must decide what each Producer under their command should produce.

Additionally, the player must decide whether to initiate a *clash* at the end of the turn.

Soldier units produced during a turn contribute to the player's *attack power* immediately, and thus count in any *clash* triggered for the turn.

Producer units produced during a turn contribute to the player's *total unit count* immediately as well.  However, new Producer units cannot produce any new units themselves until the following turn.

