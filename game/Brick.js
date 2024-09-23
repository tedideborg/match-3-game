export class Brick extends Phaser.GameObjects.Container {
    // Redo as an object that I deconstruct
    constructor(scene, id, manager, row, col, x, y, brick) {
        super(scene, x, y);
        this.id = id;
        this.manager = manager;
        this.col = col;
        this.row = row;
        this.type = brick.type;
        this.startX = x;
        this.startY = y;
        this.glow = brick.glow

        scene.add.existing(this);

        this.shadow = this.scene.add
            .graphics()
            .fillStyle(brick.shadow)
            .fillRoundedRect(0, 0, 100, 110, 10);
        this.add(this.shadow);

        this.graphics = this.scene.add
            .graphics()
            .fillStyle(brick.color)
            .fillRoundedRect(0, 0, 100, 100, 10);
        this.add(this.graphics);

        let dragDirection = null;

        this.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(0, 0, 100, 100),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            draggable: true,
            dropZone: true,
        });

        scene.input.dragDistanceThreshold = 32;

        this.on('dragstart', () => {
            dragDirection = null;
        });

        // Fix drag, make it better so that it dosent stick to the first minimal direction you drag it
        this.on('drag', (pointer, dragX, dragY) => {
            scene.children.bringToTop(this);

            if (!dragDirection) {
                if (
                    Math.abs(pointer.velocity.x) > Math.abs(pointer.velocity.y)
                ) {
                    if (pointer.velocity.x > 10) {
                        dragDirection = 'right-horizontal';
                    } else if (pointer.velocity.x < 10) {
                        dragDirection = 'left-horizontal';
                    }
                } else {
                    if (pointer.velocity.y > 10) {
                        dragDirection = 'down-vertical';
                    } else if (pointer.velocity.y < 10) {
                        dragDirection = 'up-vertical';
                    }
                }
            }

            if (dragDirection.includes('horizontal')) {
                this.x = dragX;
            } else if (dragDirection.includes('vertical')) {
                this.y = dragY;
            }
        });

        this.on('dragend', () => {
            let gameObject = this.checkNearestBrick(dragDirection);
            if (gameObject !== undefined) {
                this.swap(gameObject);
            } else {
                this.x = this.startX
                this.y = this.startY
            }
            dragDirection = null;
        });
    }

    async kill() {
        const glow = this.postFX.addGlow(this.glow, 0, 0, false, 0.1, 24);
        const emitter = this.scene.add.particles(this.x + 50, this.y + 50, "flares", {
            frame: "red",
            speed: { min: 50, max: 100 },
            blendMode: 'ADD',
            lifespan: 1800,
            gravityY: 200,
            alpha: { start: 0.8, end: 0 },
            scale: { start: 1, end: 0.5 },
            emitting: false
        })
        return new Promise(resolve => {
            return this.scene.add.timeline([
                {
                    at: 0,
                    tween: {
                        targets: glow,
                        outerStrength: 1,
                        duration: 400,
                        ease: 'Cubic.inOut',
                        completeDelay: 400,
                    }
                },
                {
                    at: 0,
                    tween: {
                        targets: this,
                        y: this.y - 10,
                        duration: 400,
                        ease: 'Cubic.inOut',
                        completeDelay: 400,
                    }
                },
                {
                    at: 550,
                    run: () => emitter.explode(6)
                },
                {
                    at: 600,
                    run: () => {
                        this.destroy()
                        resolve()
                    }
                }
            ]).play()
        })
    }

    swap(gameObject) {
        this.manager.swapBricks(this, gameObject);
    }

    checkNearestBrick(dir) {
        let horizontal = 0;
        let vertical = 0;
        if (dir.includes('horizontal')) {
            horizontal = dir.includes('left') ? -1 : 1;
        } else if (dir.includes('vertical')) {
            vertical = dir.includes('up') ? -1 : 1;
        }
        horizontal += this.col
        vertical += this.row
        if (vertical < 0 || vertical > 3 || horizontal < 0 || horizontal > 3) {
            return undefined
        }
        return this.manager.getBrick(
            horizontal,
            vertical,
        );
    }
}
