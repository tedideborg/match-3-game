import { Brick } from './Brick.js';

const colors = [
    { type: 'orange', color: '0xFECC7B', shadow: '0xB13E53' },
    { type: 'green', color: '0xA7F070', shadow: '0x257179' },
    { type: 'blue', color: '0x73EFF7', shadow: '0x3B5DC9' },
    { type: 'darkGreen', color: '0x257179', shadow: '0x29366F' },
];

export class BricksManager {
    constructor(scene, x, y, row, col) {
        this.scene = scene;
        this.bricks = [];
        this.createStage(x, y, row, col);
    }

    createStage() {
        const gridWidth = 4;
        const gridHeight = 4;
        const startX = 230; // TODO: Calculate center of screen
        const startY = 150; // TODO: Calculate center of screen
        const gap = 120;

        let posX = startX;
        let posY = startY;

        for (let i = 0; i < gridWidth; i++) {
            let bricksRow = [];
            for (let j = 0; j < gridHeight; j++) {
                let brick = colors[Math.floor(Math.random() * colors.length)];
                bricksRow.push(
                    this.placeBrick(
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
            this.bricks.push(bricksRow);
        }
    }

    getTypeToPlace(row, col) {
        this.bricks;
    }

    placeBrick(row, col, x, y, type, color, shadow) {
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

        brick1.x = brick2.startX;
        brick1.y = brick2.startY;
        brick2.x = brick1.startX;
        brick2.y = brick1.startY;

        brick1.startX = brick1.x;
        brick1.startY = brick1.y;
        brick2.startX = brick2.x;
        brick2.startY = brick2.y;

        this.checkAround(brick2);
        this.checkAround(brick1);
    }

    checkAround(brick) {
        let row = brick.row;
        let col = brick.col;
        let type = brick.type;
        let horizontalBricks = this.checkHorizontalLines(type, row, col);
        let verticalBricks = this.checkVerticalLines(type, row, col);
        let bricksToRemove = [...horizontalBricks, ...verticalBricks];
        let surroundingBricksToRemove = this.checkSurroundingBricks(
            type,
            bricksToRemove,
        );
        bricksToRemove.forEach((brick) => {
            brick.kill();
        });
        surroundingBricksToRemove.forEach((brick) => {
            brick.kill();
        });
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
            return bricks;
        } else {
            return [];
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
            return bricks;
        } else {
            return [];
        }
    }

    checkSurroundingBricks(type, bricksArray) {
        let surroundingBricks = [];
        bricksArray.forEach((brick) => {
            let row = brick.row;
            let col = brick.col;
            if (this.matchUniqueBrick(type, row, col - 1, bricksArray)) {
                surroundingBricks.push(this.bricks[row][col - 1]);
            }
            if (this.matchUniqueBrick(type, row, col + 1, bricksArray)) {
                surroundingBricks.push(this.bricks[row][col + 1]);
            }
            if (this.matchUniqueBrick(type, row - 1, col, bricksArray)) {
                surroundingBricks.push(this.bricks[row - 1][col]);
            }
            if (this.matchUniqueBrick(type, row + 1, col, bricksArray)) {
                surroundingBricks.push(this.bricks[row + 1][col]);
            }
        });
        return surroundingBricks;
    }

    matchUniqueBrick(type, row, col, bricksArray) {
        if (this.bricks[row]?.[col]?.type === type) {
            if (!bricksArray.find((e) => e.id === this.bricks[row][col].id)) {
                return true;
            }
        }
        return false;
    }
}
