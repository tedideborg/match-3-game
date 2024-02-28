export class Brick extends Phaser.GameObjects.Container {
    constructor(scene, id, manager, row, col, x, y, type, color, shadow) {
        super(scene, x, y);
        this.id = id;
        this.manager = manager;
        this.col = col;
        this.row = row;
        this.type = type;
        this.startX = x;
        this.startY = y;

        scene.add.existing(this);

        this.shadow = this.scene.add
            .graphics()
            .fillStyle(shadow)
            .fillRoundedRect(0, 0, 100, 110, 10);
        this.add(this.shadow);

        this.graphics = this.scene.add
            .graphics()
            .fillStyle(color)
            .fillRoundedRect(0, 0, 100, 100, 10);
        this.add(this.graphics);

        let dragDirection = null;

        this.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(0, 0, 100, 100),
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            draggable: true,
            dropZone: true,
        });

        scene.input.dragDistanceThreshold = 8;

        this.on('dragstart', () => {
            dragDirection = null;
        });

        this.on('drag', (pointer, dragX, dragY) => {
            scene.children.bringToTop(this);

            if (!dragDirection) {
                if (
                    Math.abs(pointer.velocity.x) > Math.abs(pointer.velocity.y)
                ) {
                    if (pointer.velocity.x > 0) {
                        dragDirection = 'right-horizontal';
                    } else {
                        dragDirection = 'left-horizontal';
                    }
                } else {
                    if (pointer.velocity.y > 0) {
                        dragDirection = 'down-vertical';
                    } else {
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
            }
            dragDirection = null;
        });
    }

    // TODO: Make a nice animation of them exploding or something similar (colorful and bright)
    kill() {
        this.destroy();
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
