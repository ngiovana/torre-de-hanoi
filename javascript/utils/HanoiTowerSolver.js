import {SierpinskiTriangle} from "../vo/SierpinskiTriangle.js";
import {MoveCommandDTO} from "../dto/MoveCommandDTO.js";
import {TowerName} from "../enum/TowerName.js";

class HanoiTowerSolver {

    #gameId;

    #sierpinskiTriangle;

    constructor(gameId, difficultLevel, firstTowerName, middleTowerName, lastTowerName) {
        this.#gameId = gameId;

        SierpinskiTriangle.nodeMap = {};
        this.#sierpinskiTriangle = new SierpinskiTriangle(difficultLevel)
        this.#sierpinskiTriangle.init()
    }

    getNextMoveCommand = (gameState) => {
        const currentDisksState = this.#sierpinskiTriangle.buildTriangleNodeDisksState(gameState.getTowerList());
        const currentNode = SierpinskiTriangle.nodeMap[currentDisksState]

        if (currentNode.betterDisksState === undefined) return;

        const newDisksState = currentNode.betterDisksState;

        let fromTowerIndex
        let toTowerIndex
        let diskToMoveIndex
        for (let diskIndex = 0; diskIndex < newDisksState.length; diskIndex++) {
            if (currentDisksState[diskIndex] !== newDisksState[diskIndex]) {
                diskToMoveIndex = diskIndex;
                break;
            }
        }

        const diskToMoveNumber = (newDisksState.length) - diskToMoveIndex;
        fromTowerIndex = parseInt(currentDisksState[diskToMoveIndex]);
        toTowerIndex = parseInt(newDisksState[diskToMoveIndex]);

        return new MoveCommandDTO(
            this.#gameId,
            diskToMoveNumber,
            TowerName.towerIndexToName(fromTowerIndex),
            TowerName.towerIndexToName(toTowerIndex),
            true
        )
    }

}

export {HanoiTowerSolver}