import { MainMenu } from './game/MainMenu.js';
import { SceneOne } from './game/SceneOne.js';
import startUi from './ui/main.js';
import Music from './music/music.js'

const gameCanvas = document.getElementById('game');
const music = new Music()

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        width: 600,
        height: 600,
    },
    parent: gameCanvas,
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
        },
    },
    scene: [MainMenu, SceneOne],
};

const game = new Phaser.Game(config);

startUi();
music.startMusic();
