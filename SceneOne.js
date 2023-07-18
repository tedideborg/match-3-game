import { BricksManager } from './BricksManager.js';
import { events } from './events.js';

export class SceneOne extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {}

    create() {
        this.stage = new BricksManager(this, 10, 10, 4, 4);

        events.on('startGame', (event) => {
            console.log(event);
        });
    }
}
