import { events } from '../utils/events.js';
import { Brick } from './Brick.js';
import { checkPositions } from '../utils/debug.js';

// Fix better glow colors
const colors = [
    { type: 'orange', color: '0xFECC7B', shadow: '0xB13E53', glow: '0xFECC7B' },
    { type: 'green', color: '0xA7F070', shadow: '0x257179', glow: '0xA7F070' },
    { type: 'blue', color: '0x73EFF7', shadow: '0x3B5DC9', glow: '0x73EFF7' },
    { type: 'red', color: '0xF05D5E', shadow: '0x29366F', glow: '0xFECC7B' }, // TODO: Fix better shadow color
    { type: 'purple', color: '0x6665DD', shadow: '0x29366F', glow: '0xFECC7B' }, // TODO: Fix better shadow color
];

const STAGE = {
    gridWidth: 4,
    gridHeight: 4,
    startX: 150, // TODO: Calculate center of screen
    startY: 150, // TODO: Calculate center of screen
    gap: 120,
}

export class BricksManager {
    constructor(scene) {
        this.scene = scene;
        this.bricks = [];
        this.createStage();
    }

    createStage() {
        let posX = STAGE.startX;
        let posY = STAGE.startY;

        for (let i = 0; i < STAGE.gridWidth; i++) {
            this.bricks[i] = [];
            for (let j = 0; j < STAGE.gridHeight; j++) {
                // TODO: Seems to not work in this case, probably because they are undefined
                let brick = this.getNextTypeToPlace(i, j);
                this.bricks[i].push(
                    this.placeNewBrick(
                        i,
                        j,
                        posX,
                        posY,
                        brick
                    ),
                );
                posX += STAGE.gap;
            }
            posY += STAGE.gap;
            posX = STAGE.startX;
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
    placeNewBrick(row, col, x, y, brick) {
        let id = Math.random() * 1000;
        return new Brick(
            this.scene,
            id,
            this,
            row,
            col,
            x,
            y,
            brick
        );
    }

    placeBrick(brick, row, col) {

    }

    getBrick(col, row) {
        return this.bricks[row][col];
    }

    // TODO: Something is wrong with swapping the bricks after you have had a winning row
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
    async checkAround(brick) {
        const ROW = brick.row;
        const COL = brick.col;
        const TYPE = brick.type;
        if (
            !this.checkHorizontalLinesForMatchingBricks(TYPE, ROW, COL) &&
            !this.checkVerticalLinesForMatchingBricks(TYPE, ROW, COL)
        ) {
            return;
        }
        const bricksToRemove = this.checkSurroundingBricks(brick, []);
        // TODO: Make this promise it's own function, as DropDownAboveBricks 
        await Promise.all(bricksToRemove.map(async brick => {
            await brick.kill()
            this.bricks[brick.row][brick.col] = undefined
        }))
        await this.dropDownAboveBricks()
        this.spawnNewBricks()
        events.emit('addScore', bricksToRemove.length * 10);
    }

    checkHorizontalLinesForMatchingBricks(type, startRow, startCol) {
        let bricks = [];
        for (let i = startCol; i < this.bricks[startRow].length; i++) {
            const brick = this.bricks[startRow][i];
            if (brick && brick.type === type) bricks.push(brick);
            else break;
        }
        for (let i = startCol; i >= 0; i--) {
            const brick = this.bricks[startRow][i];
            if (brick && brick.type === type) bricks.push(brick);
            else break;
        }
        if (bricks.length > 3) {
            return true;
        } else {
            return false;
        }
    }

    checkVerticalLinesForMatchingBricks(type, startRow, startCol) {
        let bricks = [];
        for (let i = startRow; i < this.bricks[startRow].length; i++) {
            const brick = this.bricks[i][startCol];
            if (brick && brick.type === type) bricks.push(brick);
            else break;
        }
        for (let i = startRow; i >= 0; i--) {
            const brick = this.bricks[i][startCol];
            if (brick && brick.type === type) bricks.push(brick);
            else break;
        }
        if (bricks.length > 3) {
            return true;
        } else {
            return false;
        }
    }

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

    dropDownAboveBrick(colIndex, rowIndex, brick) {
        let lowestEmptyRow = 0
        for (let i = 0; i < 4; i++) {
            if (this.bricks[i][colIndex] === undefined) {
                lowestEmptyRow = i
            }
        }
        const finalY = STAGE.gap * (lowestEmptyRow - rowIndex + rowIndex) + STAGE.startY
        this.bricks[brick.row][brick.col] = undefined
        this.bricks[lowestEmptyRow][colIndex] = brick
        brick.row = lowestEmptyRow
        return new Promise(resolve => {
            return this.scene.tweens.add({
                targets: brick,
                y: finalY,
                duration: 400,
                ease: 'Cubic.inOut',
                onComplete: () => {
                    brick.y = finalY
                    brick.startY = finalY
                    resolve()
                }
            }).play()
        })
    }

    findClosestBrickAbove(colIndex, rowIndex) {
        // Check if we are at the top of the board, if so return undefined
        if (this.bricks[rowIndex] === undefined) {
            return undefined
        }
        // Next we check if the current column has a brick, if not we run this function again and return the results
        if (this.bricks[rowIndex][colIndex] === undefined) {
            return this.findClosestBrickAbove(colIndex, rowIndex - 1)
        }
        // If it's not undefined we return the brick at that position
        return this.bricks[rowIndex][colIndex]
    }

    // TODO: Make it look like they drop down from above the screen
    spawnNewBricks() {
        this.bricks = this.bricks.map((row, rowIndex) => {
            return row.map((col, colIndex) => {
                if (col === undefined) {
                    const brick = this.getNextTypeToPlace(row, col)
                    const posX = STAGE.gap * colIndex + STAGE.startX
                    const posY = STAGE.gap * rowIndex + STAGE.startY
                    return this.placeNewBrick(
                        rowIndex,
                        colIndex,
                        posX,
                        posY,
                        brick
                    )
                } else {
                    return col
                }
            })
        })
    }

    dropDownAboveBricks() {
        const columnsToDrop = []
        const bricksToDrop = []
        for (let row = this.bricks.length - 1; row >= 0; row--) {
            for (let col = 0; col < this.bricks[row].length; col++) {
                const brick = this.bricks[row][col]
                if (brick === undefined) {
                    columnsToDrop.push(col)
                }
                if (columnsToDrop.includes(col) && brick !== undefined) {
                    bricksToDrop.push(brick)
                }
            }
        }
        return Promise.all(bricksToDrop.map(async brick => {
            return this.dropDownAboveBrick(brick.col, brick.row, brick)
        }))
    }
}