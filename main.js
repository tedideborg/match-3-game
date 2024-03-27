import { MainMenu } from './game/MainMenu.js';
import { SceneOne } from './game/SceneOne.js';
import startUi from './ui/main.js';

const gameCanvas = document.getElementById('game');

const config = {
    type: Phaser.AUTO,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 800,
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
