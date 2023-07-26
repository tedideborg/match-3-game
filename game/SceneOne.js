import { BricksManager } from './BricksManager.js';
import { events } from '../utils/events.js';

export class SceneOne extends Phaser.Scene {
    constructor() {
        super('sceneOne');
    }

    preload() {}

    create() {
        this.stage = new BricksManager(this);

        events.on('startGame', (event) => {
            console.log(event);
        });
    }
}
