# My match 3 game

My small and simple little match-3 game that I've made with Phaser 3 and SolidJs

ONLY WORKS ON DESKTOP FOR NOW, MOBILE LAYOUT IS MESSED UP ATM!

## TODO

-   [ ] Make better import for all css, like import all css in one global css file
-   [X] Structure ui folder better
-   [ ] Make useful css variables and best practices, look at Kevin Powell videos
-   [ ] When game is done, restructure, clean up and make into a template
    -   [ ] Document this template as well, the css classes, util functions, the event system and so forth
-   [ ] Make the background of the popup clickable to be able to close it that way as well (check how Pico css does it)
    -   [ ] Add a settings button to the popup as well
-   [X] Create nice bokeh effect
-   [X] Fix layouting in mobile layouts and sizing
-   [X] Dropping in new symbols dont get cleared if they create a new winning line, fix so that it checks for new winnings when landing
-   [ ] Create music and sfx for the game
-   [X] Particles look low-res, make them high-res and don't scale them as much
-   [X] Make the scene start when you start the entire game, now it seems that it doesn't always start correctly when clicking start game. Maybe just hide it when game is started and then show it when the player clicks start game
-   [X] Make bokeh animations loop back and forth.
-   [X] Scroll bars are showing but shouldn't be.
-   [X] Game area is taking up too much space, should be smaller
