import {Triangle} from "./Triangle.js";
import {Utils} from "../utils/Utils.js";
import {TriangleNode} from "./TriangleNode.js";

class SierpinskiTriangle {

    static MIN_DISK_COUNT = 1
    static TOWER_COUNT = 3

    static nodeMap = {};

    #left = [0, 1];
    #top = [0, 2];
    #right = [1, 2];

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

        this.#countTop = countTop;
        this.#countLeft = countRight;
        this.#countRight = countLeft;

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
                if (gameState[towerIndex].some((diskNumber) => diskNumber === diskIndex )) {
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

        SierpinskiTriangle.nodeMap[leftNode.disksState] = leftNode;
        SierpinskiTriangle.nodeMap[topNode.disksState] = topNode;
        SierpinskiTriangle.nodeMap[rightNode.disksState] = rightNode;
    }

    #updateTriangleNodes = () => {
        this.#triangle.leftNode = this.#triangle.left.leftNode;
        this.#triangle.topNode = this.#triangle.top.topNode;
        this.#triangle.rightNode = this.#triangle.right.rightNode;

        this.#setBestAndMidName(
            this.#triangle.left.rightNode,
            this.#triangle.left.topNode,
            this.#triangle.right.leftNode,
            this.#triangle.left.leftNode
        );

        this.#setBestAndMidName(
            this.#triangle.top.rightNode,
            this.#triangle.top.topNode,
            this.#triangle.right.topNode,
            this.#triangle.top.leftNode
        );

        this.#setBestAndMidName(
            this.#triangle.left.topNode,
            this.#triangle.top.leftNode,
            this.#triangle.left.rightNode,
            this.#triangle.left.leftNode
        );

        this.#setBestAndMidName(
            this.#triangle.right.topNode,
            this.#triangle.top.rightNode,
            this.#triangle.right.rightNode,
            this.#triangle.right.leftNode
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

    #buildLeftTriangle = () =>  {
        this.#triangle.left = new SierpinskiTriangle(
            this.#diskCount,
            this.#iterationNumber - 1,
            this.#top,
            this.#left,
            this.#flip(this.#right),
            this.#countTop,
            this.#countRight,
            this.#countLeft + 1,
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
            this.#countRight + 1,
            this.#countLeft,
            Utils.deepClone(this.#carryDisks(this.#gameState, this.#iterationNumber, this.#right[1])),
        ).init();
    }

    #buildTopTriangle = () => {
        this.#triangle.top = new SierpinskiTriangle(
            this.#diskCount,
            this.#iterationNumber - 1,
            this.#flip(this.#right),
            this.#flip(this.#left),
            this.#flip(this.#top),
            this.#countTop + 1,
            this.#countRight,
            this.#countLeft,
            Utils.deepClone(this.#carryDisks(this.#gameState, this.#iterationNumber, this.#left[1])),
        ).init();
    }

    #buildLeftTower = () => {
        const newGameState = Utils.deepClone(this.#carryDisks(this.#gameState, this.#iterationNumber, this.#left[0]));
        const disksState = this.#buildTriangleNodeDisksState(newGameState);

        // console.log("+++++++++++++++++++++++++++++++++++")
        // console.log(this.#gameState[0], this.#gameState[1], this.#gameState[2], this.#gameState)
        // console.log(newGameState[0], newGameState[1], newGameState[2], newGameState)
        // console.log("+++++++++++++++++++++++++++++++++++")

        this.#triangle.leftNode = new TriangleNode(disksState);
        this.#triangle.leftNode.setCounters(this.#countTop, this.#countRight, this.#countLeft + 1);
    }

    #buildRightTower = () => {
        const newGameState = Utils.deepClone(this.#carryDisks(this.#gameState, this.#iterationNumber, this.#right[1]));
        const disksState = this.#buildTriangleNodeDisksState(newGameState);

        this.#triangle.rightNode = new TriangleNode(disksState);
        this.#triangle.rightNode.setCounters(this.#countTop, this.#countRight + 1, this.#countLeft);
    }

    #buildTopTower = () => {
        const newGameState = Utils.deepClone(this.#carryDisks(this.#gameState, this.#iterationNumber, this.#left[1]));
        const disksState = this.#buildTriangleNodeDisksState(newGameState);

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
        const gameState = [[],[],[]];

        Array.from({ length: diskCount }).forEach((_, diskNumber) => {
            gameState[0].push(diskCount - diskNumber - 1);
        });

        return gameState;
    }

}


export {SierpinskiTriangle}