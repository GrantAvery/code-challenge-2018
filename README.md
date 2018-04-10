Code Challenge 2018
===================

Thank you for your interest in Bravo LT's Google I/O Extended Event Code Challenge 2018 (that's a mouthful!)!  This year, instead of solving the Travelling Salesman Problem or getting artistic with your favorite esoteric language, participants will be expected to produce an **AI "bot"** for a simple game!

The game is designed to be simple enough to understand in 5 minutes, but interesting enough that it is entertaining to play and/or watch.

The software is designed to be simple enough where a viable AI bot could be produced in a few minutes, but complex enough to provide a platform for your ingenuity (and overwhelming strategic prowess) to shine through in your AI creation!

The rest of this README consists of an explanation of the game. Please stay tuned for details about how to go about building your AI and how to submit your AI so that it can go head-to-head with AIs written by other participants (including some Bravo LT engineers)!


# CodeClash Game

CodeClash is a simple, concurrent-turn-based strategy game where players try to amass enough fighting units to overwhelm their enemy in a single decisive battle.


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

