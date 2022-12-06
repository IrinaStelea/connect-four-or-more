# 🔴 Connect4/more - Online two-player game 🟡

## Live at:

https://connect4-more.herokuapp.com

## Overview

Online two-player game where users take turns 'dropping' pieces into a slot-based gameboard.

The first user who manages to connect horizontally, vertically or diagonally four or more of their own pieces wins.

📱 🖥 Optimized for both mobile & desktop.

👨‍💻👩‍💻 Made by [@RobertMoravek](https://www.github.com/RobertMoravek) and [@IrinaStelea](https://www.github.com/IrinaStelea)

## Features

-   Two-player setup

    -   the player who starts the game (admin) invites the opponent via a unique code

-   Customisable game board

    -   the number of rows, column and slots required to win can be chosen by the admin player from a predefined range

-   Realtime game experience

    -   the game updates to the next state depending on the status/choices of each player
    -   the game reacts to the player whose turn it is and, once a slot has been added, it shows the outcome to both players

-   Victory / draw

    -   in case of victory / loss / draw, the game displays the relevant notification to each player

-   Multiple games

    -   each of the two players can choose to invite the opponent to a new game
    -   the admin player can re-configure the board in-between games
    -   score updates accordingly

-   Animated game elements and user-friendly design

-   Other functionalities
    -   when a user leaves the game / is disconnected, the other user gets a relevant notification
    -   server-side validation of the game configuration
    -   client & server-side validation of moves
    -   player turn is random for first game and alternates for the next games in the same streak
    -   error handling

## Technology

-   Typescript (Backend and Frontend)
-   Vue3 (Composition API + Script Setup)
-   Node.js & Express
-   Socket.io

## Set up this project locally

-   clone the repository
-   install all the dependencies with `npm install`
-   run the project locally with `npm run dev` and open it at `localhost:8080`

## Previews

### Game start & configuration

<img src="readme-assets/game_start.gif">

<br>

### Realtime game experience: playing

<img src="readme-assets/playing.gif">

<br>

### Realtime game experience: results

<img src="readme-assets/results.gif">

<br>

### Multiple games

<img src="readme-assets/play_again.gif">

### User leave/disconnect

<img src="readme-assets/leave_disconnect.gif">

<br>
