import {Triangle} from "./Triangle.js";
import {Utils} from "../utils/Utils.js";
import {TriangleNode} from "./TriangleNode.js";

class SierpinskiTriangle {

    static MIN_DISK_COUNT = 1
    static TOWER_COUNT = 3

    static nodeMap = {};
    static triangleMap = {};

    #left;
    #top;
    #right;

    #countTop;
    #countRight;
    #countLeft;

    #diskCount;
    #iterationNumber;
    #gameState;
    #triangle;

    constructor(
        diskCount,
        iterationNumber = (diskCount - 1),
        left = [0, 1],
        top = [0, 2],
        right = [1, 2],
        countTop = 0,
        countRight = 0,
        countLeft = 0,
        gameState = SierpinskiTriangle.#buildInitialGameState(diskCount)
    ) {
        this.#diskCount = diskCount;

        this.#iterationNumber = iterationNumber;

        this.#left = left;
        this.#top = top;
        this.#right = right;

        this.#countTop = countTop;
        this.#countLeft = countLeft;
        this.#countRight = countRight;

        this.#gameState = gameState;

        this.#triangle = new Triangle()
    }

    init = () => {
        if (this.#diskCount < SierpinskiTriangle.MIN_DISK_COUNT) return new Triangle();

        if (this.#iterationNumber > 0) {
            this.#buildTriangles();
        } else {
            this.#buildTowers();
        }

        if (this.#iterationNumber === 0) {
            this.#setupInitialTriangle();
        }

        if (this.#triangle.left !== undefined) {
            this.#updateTriangleNodes();
        }

        return this.#triangle;
    }

    buildTriangleNodeDisksState = (gameState) => {
        let disksState = "";

        for (let diskIndex = 0; diskIndex < this.#diskCount; diskIndex++) {
            for (let towerIndex = 0; towerIndex < SierpinskiTriangle.TOWER_COUNT; towerIndex++) {
                if (gameState[towerIndex].some((diskNumber) => diskNumber === diskIndex)) {
                    disksState = towerIndex.toString() + disksState;
                    break;
                }
            }
        }

        return disksState;
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

    #setupInitialTriangle = () => {
        const leftNode = this.#triangle.leftNode;
        const topNode = this.#triangle.topNode;
        const rightNode = this.#triangle.rightNode;

        if (this.#shouldGoRight(leftNode)) {
            leftNode.betterDisksState = rightNode.disksState;
            leftNode.relativeDisksState = topNode.disksState;
        } else {
            leftNode.betterDisksState = topNode.disksState;
            leftNode.relativeDisksState = rightNode.disksState;
        }

        topNode.worseDisksState = leftNode.disksState;
        rightNode.worseDisksState = leftNode.disksState;

        this.#storeTriangleInfo(this.#triangle)
    }

    #storeTriangleInfo(triangle) {
        SierpinskiTriangle.nodeMap[triangle.leftNode.disksState] = triangle.leftNode;
        SierpinskiTriangle.nodeMap[triangle.topNode.disksState] = triangle.topNode;
        SierpinskiTriangle.nodeMap[triangle.rightNode.disksState] = triangle.rightNode;

        SierpinskiTriangle.triangleMap[triangle.leftNode.disksState] = triangle;
        SierpinskiTriangle.triangleMap[triangle.topNode.disksState] = triangle;
        SierpinskiTriangle.triangleMap[triangle.rightNode.disksState] = triangle;
    }

    #updateTriangleNodes = () => {
        this.#triangle.leftNode = this.#triangle.left.leftNode;
        this.#triangle.topNode = this.#triangle.top.topNode;
        this.#triangle.rightNode = this.#triangle.right.rightNode;

        let originalTriangle = SierpinskiTriangle.triangleMap[this.#triangle.left.rightNode.disksState];
        this.#setBestAndMidName(
            this.#triangle.left.rightNode,
            originalTriangle.topNode,
            this.#triangle.right.leftNode,
            originalTriangle.leftNode
        );

        originalTriangle = SierpinskiTriangle.triangleMap[this.#triangle.top.rightNode.disksState];
        this.#setBestAndMidName(
            this.#triangle.top.rightNode,
            originalTriangle.topNode,
            this.#triangle.right.topNode,
            originalTriangle.leftNode
        );

        originalTriangle = SierpinskiTriangle.triangleMap[this.#triangle.left.topNode.disksState];
        this.#setBestAndMidName(
            this.#triangle.left.topNode,
            this.#triangle.top.leftNode,
            originalTriangle.rightNode,
            originalTriangle.leftNode
        );

        originalTriangle = SierpinskiTriangle.triangleMap[this.#triangle.right.topNode.disksState];
        this.#setBestAndMidName(
            this.#triangle.right.topNode,
            this.#triangle.top.rightNode,
            originalTriangle.rightNode,
            originalTriangle.leftNode
        );

        if (this.#triangle.top.leftNode.worseDisksState === undefined) {
            this.#triangle.top.leftNode.worseDisksState = this.#triangle.left.topNode.disksState;
        }

        if (this.#triangle.right.leftNode.worseDisksState === undefined) {
            this.#triangle.right.leftNode.worseDisksState = this.#triangle.left.rightNode.disksState;
        }
    }

    #setBestAndMidName = (triangleNode, firstOption, secondOption, thirdOption) => {
        if (triangleNode.betterDisksState === undefined) {
            if (this.#shouldGoRight(triangleNode)) {
                triangleNode.betterDisksState = secondOption.disksState;
                triangleNode.relativeDisksState = firstOption.disksState;
            } else {
                triangleNode.betterDisksState = firstOption.disksState;
                triangleNode.relativeDisksState = secondOption.disksState;
            }
        }

        if (this.#shouldGoLeft(triangleNode)) {
            triangleNode.worseDisksState = triangleNode.relativeDisksState;
            triangleNode.relativeDisksState = thirdOption.disksState;
        } else {
            triangleNode.worseDisksState = thirdOption.disksState;
        }
    }

    #buildLeftTriangle = () => {
        this.#triangle.left = new SierpinskiTriangle(
            this.#diskCount,
            this.#iterationNumber - 1,
            this.#top,
            this.#left,
            this.#flip(this.#right),
            this.#countTop,
            this.#countRight,
            this.#countLeft + Math.pow(this.#iterationNumber, this.#iterationNumber),
            Utils.deepClone(this.#carryDisks(this.#gameState, this.#iterationNumber, this.#left[0])),
        ).init();
    }

    #buildRightTriangle = () => {
        this.#triangle.right = new SierpinskiTriangle(
            this.#diskCount,
            this.#iterationNumber - 1,
            this.#flip(this.#left),
            this.#right,
            this.#top,
            this.#countTop,
            this.#countRight + Math.pow(this.#iterationNumber, this.#iterationNumber),
            this.#countLeft,
            Utils.deepClone(this.#carryDisks(this.#gameState, this.#iterationNumber, this.#right[1])),
        ).init();
    }

    #buildTopTriangle = () => {
        this.#triangle.top = new SierpinskiTriangle(
            this.#diskCount,
            this.#iterationNumber - 1,
            this.#flip(this.#right),
            this.#flip(this.#top),
            this.#flip(this.#left),
            this.#countTop + Math.pow(this.#iterationNumber, this.#iterationNumber),
            this.#countRight,
            this.#countLeft,
            Utils.deepClone(this.#carryDisks(this.#gameState, this.#iterationNumber, this.#left[1])),
        ).init();
    }

    #buildLeftTower = () => {
        const newGameState = Utils.deepClone(this.#carryDisks(this.#gameState, this.#iterationNumber, this.#left[0]));
        const disksState = this.buildTriangleNodeDisksState(newGameState);

        this.#triangle.leftNode = new TriangleNode(disksState);
        this.#triangle.leftNode.setCounters(this.#countTop, this.#countRight, this.#countLeft + 1);
    }

    #buildRightTower = () => {
        const newGameState = Utils.deepClone(this.#carryDisks(this.#gameState, this.#iterationNumber, this.#right[1]));
        const disksState = this.buildTriangleNodeDisksState(newGameState);

        this.#triangle.rightNode = new TriangleNode(disksState);
        this.#triangle.rightNode.setCounters(this.#countTop, this.#countRight + 1, this.#countLeft);
    }

    #buildTopTower = () => {
        const newGameState = Utils.deepClone(this.#carryDisks(this.#gameState, this.#iterationNumber, this.#left[1]));
        const disksState = this.buildTriangleNodeDisksState(newGameState);

        this.#triangle.topNode = new TriangleNode(disksState);
        this.#triangle.topNode.setCounters(this.#countTop + 1, this.#countRight, this.#countLeft);
    }

    #carryDisks(gameState, base, to) {
        const from = this.#getDiskLocation(gameState, base);
        if (from === to) return gameState;

        for (let index = 0; gameState[from].length > index; index++) {
            if (gameState[from][index] <= base) {
                gameState[to].push(gameState[from][index]);
            }
        }

        for (let index = gameState[from].length - 1; index >= 0; index--) {
            if (gameState[from][index] <= base) {
                gameState[from].splice(index, 1)
            }
        }

        return gameState;
    }

    #getDiskLocation(gameState, base) {
        let location = -1;

        for (let towerIndex = 0; SierpinskiTriangle.TOWER_COUNT > towerIndex; towerIndex++) {
            for (let diskIndex = 0; gameState[towerIndex].length > diskIndex; diskIndex++) {
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

    #shouldGoRight = (triangleNode) => {
        if (triangleNode.disksState[0] === "2") return true;
        if (triangleNode.disksState[0] === "1") return false;

        return triangleNode.rightCount > triangleNode.topCount;
    }

    #shouldGoLeft = (triangleNode) => {
        if (triangleNode.disksState[0] === "0") return false;

        if (triangleNode.disksState[0] === "1") {
            return triangleNode.topCount > triangleNode.rightCount;
        }

        return triangleNode.rightCount > triangleNode.topCount;
    }

    static #buildInitialGameState = (diskCount) => {
        const gameState = [[], [], []];

        Array.from({length: diskCount}).forEach((_, diskNumber) => {
            gameState[0].push(diskCount - diskNumber - 1);
        });

        return gameState;
    }

}

export {SierpinskiTriangle}