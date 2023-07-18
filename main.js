import { SceneOne } from './SceneOne.js';

const gameCanvas = document.getElementById('game');

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: gameCanvas,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
        },
    },
    scene: SceneOne,
};

const game = new Phaser.Game(config);
