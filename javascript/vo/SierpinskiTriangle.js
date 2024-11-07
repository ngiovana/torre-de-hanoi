import {Triangle} from "./Triangle.js";
import {Utils} from "../utils/Utils.js";
import {TriangleNode} from "./TriangleNode.js";

class SierpinskiTriangle {

    static MIN_DISK_COUNT = 1
    static MAX_DISK_COUNT = 8

    static TOWER_COUNT = 3


    left = [0, 1];

    top = [0, 2];

    right = [1, 2];

    nodeMap;

    diskCount;

    iterationNumber;

    gameState;

    triangle;

    countTop;

    countRight;

    countLeft;

    constructor(
        diskCount,
        iterationNumber = diskCount - 1,
        left = [0, 1],
        top = [0, 2],
        right = [1, 2],
        countTop = 0,
        countRight = 0,
        countLeft = 0,
        gameState = SierpinskiTriangle.#buildGameState(diskCount)
    ) {
        this.diskCount = diskCount;

        this.iterationNumber = iterationNumber;

        this.countTop = countTop;
        this.countLeft = countRight;
        this.countRight = countLeft;

        this.gameState = gameState;
    }

    init = () => {
        if (this.diskCount < SierpinskiTriangle.MIN_DISK_COUNT) return new Triangle();

        if (this.iterationNumber > 0) {
            this.#buildTriangles();
        } else {
            this.#buildTowers();
        }

        if (this.iterationNumber == 0) {
            this.#setupInitialTriangle();
        }

        if (this.triangle.left != null) {
            this.#updateTriangleNodes();
        }

        return this.triangle;
    }

    #buildTriangles = () => {
        this.#buildLeftTriangle();
        this.#buildTopTriangle();
        this.#buildRightTriangle();
    }

    #buildTowers = () => {
        this.#buildLeftTower();
        this.#buildTopTower();
        this.#buildRightTower();
    }

    #buildLeftTriangle = () =>  {
        this.triangle.left = new SierpinskiTriangle(
            this.diskCount,
            this.iterationNumber-1,
            this.top,
            this.left,
            this.#flip(this.right),
            this.countTop,
            this.countRight,
            this.countLeft + 1,
            Utils.deepClone(this.#carryDisks(this.gameState, this.iterationNumber, this.left[0])),
        ).init();
    }

    #buildRightTriangle = () => {
        this.triangle.right = new SierpinskiTriangle(
            this.diskCount,
            this.iterationNumber-1,
            this.#flip(this.left),
            this.right,
            this.top,
            this.countTop,
            this.countRight + 1,
            this.countLeft,
            Utils.deepClone(this.#carryDisks(this.gameState, this.iterationNumber, this.right[1])),
        ).init();
    }

    #buildTopTriangle = () => {
        this.triangle.top = new SierpinskiTriangle(
            this.diskCount,
            this.iterationNumber - 1,
            this.#flip(this.right),
            this.#flip(this.left),
            this.#flip(this.top),
            this.countTop + 1,
            this.countRight,
            this.countLeft,
            Utils.deepClone(this.#carryDisks(this.gameState, this.iterationNumber, this.left[1])),
        ).init();
    }

    #buildLeftTower = () => {
        const newGameState = Utils.deepClone(this.#carryDisks(this.gameState, this.iterationNumber, this.left[0]));
        const name = this.#buildNodeName(newGameState);

        this.triangle.leftNode = new TriangleNode(name);
        this.triangle.leftNode.setCounters(this.countTop, this.countRight, this.countLeft + 1);
    }

    #buildRightTower = () => {
        const newGameState = Utils.deepClone(this.#carryDisks(this.gameState, this.iterationNumber, this.right[1]));
        const name = this.#buildNodeName(newGameState);

        this.triangle.rightNode = new TriangleNode(name);
        this.triangle.rightNode.setCounters(this.countTop, this.countRight + 1, this.countLeft);
    }

    #buildTopTower = () => {
        const newGameState = Utils.deepClone(this.#carryDisks(this.gameState, this.iterationNumber, this.left[1]));
        const name = this.#buildNodeName(newGameState);

        this.triangle.topNode = new TriangleNode(name);
        this.triangle.topNode.setCounters(this.countTop + 1, this.countRight, this.countLeft);
    }


    #buildNodeName = (gameState) => {
        let name = "";

        for (let diskIndex = this.diskCount - 1; 0 <= diskIndex; diskIndex--) {
            for (let towerIndex = 0; SierpinskiTriangle.TOWER_COUNT > towerIndex; towerIndex++) {
                if (gameState[towerIndex].some((diskNumber) => diskNumber === diskIndex )) {
                    name += towerIndex;
                    break;
                }
            }
        }

        return name.toString();
    }

    #carryDisks(gameState, base, to) {
        const from = this.#getDiskLocation(gameState, base);
        if (from === to) return gameState;

        for (let index = 0; gameState[from].size() > index; index++) {
            if (gameState[from][index] <= base) {
                gameState[to].push(gameState[from][index]);
            }
        }

        for (let index = gameState[from].size() - 1; index >= 0; index--) {
            if (gameState[from][base] <= base) {
                gameState[from].splice(index, 1)
            }
        }

        return gameState;
    }

    #getDiskLocation(gameState, base) {
        let location = -1;

        for (let towerIndex = 0; SierpinskiTriangle.TOWER_COUNT > towerIndex; towerIndex++) {
            for (let diskIndex = 0; gameState[towerIndex].size() > diskIndex; diskIndex++) {
                if (gameState[towerIndex][diskIndex] === base) {
                    location = towerIndex;
                    break;
                }
            }
        }

        return location;
    }

    #flip = (list) => {
        return Utils.deepClone(list).reverse()
    }

    static #buildGameState = (diskCount) => {
        const gameState = [[],[],[]];

        Array.from({ length: diskCount }).forEach((_, diskNumber) => {
            gameState[0].push(diskNumber);
        });

        return gameState;
    }

}


export {SierpinskiTriangle}