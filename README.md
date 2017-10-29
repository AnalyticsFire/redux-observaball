# Redux Observaball

Redux Observable is awesome, but it is overkill for most frontend apps that simply need to make AJAX calls.

This repo is meant to demonstrate its strength in applications with high frequeny, complicated events.

## App Structure

* React is used for html-presentation layer.
* D3 is used for data presentation layer (ie svg graphics).
  * shared/lib/game/index.js actually has its own Redux listener to update the graphics.
* redux-observable is used for data storage layer.

## Game Rules

* The balls' mass is proportional to its area - ie larger balls weigh more.
* All balls are subject to equal constant acceleration.
* Press the buttons to apply an upward force on a ball.
* As you apply upward force, you lose strength and the force applied diminishes proportional to the strength meter to the right.
* The points earned are proportional to the mass of each ball *times* the time before the first ball falls off the board.
* As time goes on, you replenish your strength less quickly!
