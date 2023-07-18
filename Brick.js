export class Brick extends Phaser.GameObjects.Rectangle {
    constructor(scene, id, manager, row, col, x, y, type, color) {
        super(scene, x, y, 100, 100, color);
        this.id = id;
        this.manager = manager;
        this.col = col;
        this.row = row;
        this.type = type;
        this.startX = x;
        this.startY = y;

        let dragDirection = null;

        scene.add.existing(this);

        this.setInteractive({ draggable: true, dropZone: true });
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

            // TODO: Limit the distance draggable
            // if (dragX < 40 || dragY < 40) {
            //     this.x = 40;
            //     this.y = 40;
            // }
        });

        this.on('dragend', () => {
            let gameObject = this.checkNearestBrick(dragDirection);
            this.swap(gameObject);
            dragDirection = null;
        });
    }

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
        return this.manager.getBrick(
            this.col + horizontal,
            this.row + vertical,
        );
    }
}
