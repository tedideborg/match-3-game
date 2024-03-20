import { BricksManager } from './BricksManager.js';
import { events } from '../utils/events.js';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('mainMenu');
    }

    preload() {
        this.load.atlas("flares", "assets/flares.png", "assets/flares.json")
    }

    create() {
        events.on('changeScene', (event) => {
            this.scene.start('sceneOne');
        });
    }
}
