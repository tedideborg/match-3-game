import { events } from '../utils/events.js';
import { Brick } from './Brick.js';

const colors = [
    { type: 'orange', color: '0xFECC7B', shadow: '0xB13E53' },
    { type: 'green', color: '0xA7F070', shadow: '0x257179' },
    { type: 'blue', color: '0x73EFF7', shadow: '0x3B5DC9' },
    { type: 'red', color: '0xF05D5E', shadow: '0x29366F' }, // TODO: Fix better shadow color
    { type: 'purple', color: '0x6665DD', shadow: '0x29366F' }, // TODO: Fix better shadow color
];

export class BricksManager {
    constructor(scene) {
        this.scene = scene;
        this.bricks = [];
        this.createStage();
    }

    createStage() {
        const gridWidth = 4;
        const gridHeight = 4;
        const startX = 150; // TODO: Calculate center of screen
        const startY = 150; // TODO: Calculate center of screen
        const gap = 120;

        let posX = startX;
        let posY = startY;

        for (let i = 0; i < gridWidth; i++) {
            this.bricks[i] = [];
            for (let j = 0; j < gridHeight; j++) {
                let brick = this.getNextTypeToPlace(i, j);
                this.bricks[i].push(
                    this.placeNewBrick(
                        i,
                        j,
                        posX,
                        posY,
                        brick.type,
                        brick.color,
                        brick.shadow,
                    ),
                );
                posX += gap;
            }
            posY += gap;
            posX = startX;
        }
    }

    getNextTypeToPlace(row, col) {
        let brick = colors[Math.floor(Math.random() * colors.length)];
        let usedColors = [...colors];
        while (this.matchSurroundingBricks(brick.type, row, col)) {
            usedColors = usedColors.filter((col) => col.type !== brick.type);
            brick = usedColors[Math.floor(Math.random() * usedColors.length)];
        }
        return brick;
    }

    // Use destructuring here instead?
    placeNewBrick(row, col, x, y, type, color, shadow) {
        let id = Math.random() * 1000;
        const brick = new Brick(
            this.scene,
            id,
            this,
            row,
            col,
            x,
            y,
            type,
            color,
            shadow,
        );
        return brick;
    }

    placeBrick(brick, row, col) {

    }

    getBrick(col, row) {
        return this.bricks[row][col];
    }

    swapBricks(goOne, goTwo) {
        let brick1 = this.bricks[goOne.row][goOne.col];
        let brick2 = this.bricks[goTwo.row][goTwo.col];

        this.bricks[goOne.row][goOne.col] = brick2;
        this.bricks[goTwo.row][goTwo.col] = brick1;

        [brick1.row, brick2.row] = [brick2.row, brick1.row];
        [brick1.col, brick2.col] = [brick2.col, brick1.col];

        // TODO: Removed too fast when matching. Make it wait for tween to finish
        this.scene.tweens.add({
            targets: brick2,
            x: brick1.startX,
            y: brick1.startY,
            duration: 100,
            ease: 'Cubic.inOut',
            onCompleteParams: { x: brick1.startX, y: brick1.startY },
            onComplete: (tween, target, data) => {
                brick2.x = data.x;
                brick2.y = data.y;
                brick2.startX = brick2.x;
                brick2.startY = brick2.y;
            },
        });

        this.scene.tweens.add({
            targets: brick1,
            x: brick2.startX,
            y: brick2.startY,
            duration: 100,
            ease: 'Cubic.inOut',
            onCompleteParams: { x: brick2.startX, y: brick2.startY },
            completeDelay: 100,
            onComplete: (tween, target, data) => {
                brick1.x = data.x;
                brick1.y = data.y;
                brick1.startX = brick1.x;
                brick1.startY = brick1.y;
                this.checkAround(brick2);
                this.checkAround(brick1);
            },
        });
    }

    // TODO: Rename this function or split up, to make sense
    checkAround(brick) {
        const ROW = brick.row;
        const COL = brick.col;
        const TYPE = brick.type;
        if (
            !this.checkHorizontalLines(TYPE, ROW, COL) &&
            !this.checkVerticalLines(TYPE, ROW, COL)
        ) {
            return;
        }
        const bricksToRemove = this.checkSurroundingBricks(brick, []);
        bricksToRemove.forEach((brick) => {
            brick.kill()
            this.bricks[brick.row][brick.col] = undefined
        });
        this.dropDownAboveBricks(bricksToRemove)
        this.spawnNewBricks()
        events.emit('addScore', bricksToRemove.length * 10);
    }

    checkHorizontalLines(type, startRow, startCol) {
        let bricks = [];
        for (let i = startCol; i < this.bricks[startRow].length; i++) {
            const element = this.bricks[startRow][i];
            if (element.type === type) bricks.push(element);
            else break;
        }
        for (let i = startCol; i >= 0; i--) {
            const element = this.bricks[startRow][i];
            if (element.type === type) bricks.push(element);
            else break;
        }
        if (bricks.length > 3) {
            return true;
        } else {
            return false;
        }
    }

    checkVerticalLines(type, startRow, startCol) {
        let bricks = [];
        for (let i = startRow; i < this.bricks[startRow].length; i++) {
            const element = this.bricks[i][startCol];
            if (element.type === type) bricks.push(element);
            else break;
        }
        for (let i = startRow; i >= 0; i--) {
            const element = this.bricks[i][startCol];
            if (element.type === type) bricks.push(element);
            else break;
        }
        if (bricks.length > 3) {
            return true;
        } else {
            return false;
        }
    }

    // TODO: Redo as a recursion function
    checkSurroundingBricks(brick, bricksArray) {
        const ROW = brick.row;
        const COL = brick.col;
        const TYPE = brick.type;

        if (this.matchUniqueBrick(TYPE, ROW, COL - 1, bricksArray)) {
            bricksArray.push(this.bricks[ROW][COL - 1]);
            this.checkSurroundingBricks(this.bricks[ROW][COL - 1], bricksArray);
        }
        if (this.matchUniqueBrick(TYPE, ROW, COL + 1, bricksArray)) {
            bricksArray.push(this.bricks[ROW][COL + 1]);
            this.checkSurroundingBricks(this.bricks[ROW][COL + 1], bricksArray);
        }
        if (this.matchUniqueBrick(TYPE, ROW - 1, COL, bricksArray)) {
            bricksArray.push(this.bricks[ROW - 1][COL]);
            this.checkSurroundingBricks(this.bricks[ROW - 1][COL], bricksArray);
        }
        if (this.matchUniqueBrick(TYPE, ROW + 1, COL, bricksArray)) {
            bricksArray.push(this.bricks[ROW + 1][COL]);
            this.checkSurroundingBricks(this.bricks[ROW + 1][COL], bricksArray);
        }
        return bricksArray;
    }

    matchSurroundingBricks(type, row, col) {
        if (this.bricks[row]?.[col - 1]?.type === type) {
            return true;
        }
        if (this.bricks[row]?.[col + 1]?.type === type) {
            return true;
        }
        if (this.bricks[row - 1]?.[col]?.type === type) {
            return true;
        }
        if (this.bricks[row + 1]?.[col]?.type === type) {
            return true;
        }
        return false;
    }

    matchUniqueBrick(type, row, col, bricksArray) {
        if (this.bricks[row]?.[col]?.type === type) {
            if (!bricksArray) return true;
            if (!bricksArray.find((e) => e.id === this.bricks[row][col].id)) {
                return true;
            }
        }
        return false;
    }

    dropDownAboveBrick(col, row, y, nextRow) {
        if (this.bricks[row] === undefined) {
            return
        } else if (this.bricks[row][col] === undefined) {
            this.dropDownAboveBrick(col, row + 1, y, nextRow)
        }
        const brick = this.bricks[row][col]
        const currentY = brick.y
        brick.row = nextRow
        this.bricks[nextRow][col] = brick
        this.bricks[row][col] = undefined
        brick.y = y
        if (this.bricks[row - 1] !== undefined) {
            this.dropDownAboveBrick(col, row - 1, currentY, row + 1)
        }
    }

    // TODO: Spawn new bricks at the undefined places in the array
    spawnNewBricks() {
        this.bricks.forEach(row => {
            row.forEach(col => {
                if (col === undefined) {
                    const brick = this.getNextTypeToPlace(row, col)
                }
            })
        })
    }

    dropDownAboveBricks(winBricks) {
        winBricks.forEach((brick) => {
            let row = brick.row;
            let col = brick.col;
            this.dropDownAboveBrick(col, row - 1, brick.y)
        });
    }
}
