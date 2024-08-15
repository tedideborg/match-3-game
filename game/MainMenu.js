import { BricksManager } from './BricksManager.js';
import { events } from '../utils/events.js';

export class MainMenu extends Phaser.Scene {
    constructor() {
        super('mainMenu');
    }

    preload() {
        this.load.atlas("flares", "assets/flares.png", "assets/flares.json")
        this.load.audio("music", ["assets/music.mp3"])
    }

    create() {
        this.music = this.sound.add("music", {loop: true})
        // this.music.play()

        events.on('changeScene', (event) => {
            this.scene.start('sceneOne');
        });

        events.on('toggleMusic', (event) => {
            if (this.music.isPlaying) {
                this.music.stop()
            } else {
                this.music.play()
            }
        })

        events.on('toggleSfx', (event) => {
        })
    }
}
