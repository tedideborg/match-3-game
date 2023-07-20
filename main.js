import { SceneOne } from './SceneOne.js';

const gameCanvas = document.getElementById('game');

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 800,
    parent: gameCanvas,
    backgroundColor: '1A1C2C',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
        },
    },
    scene: SceneOne,
};

const game = new Phaser.Game(config);
