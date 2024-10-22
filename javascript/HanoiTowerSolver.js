import {MoveCommand} from "./MoveCommand.js";

class HanoiTowerSolver {

    /**
     * @type {Array<MoveCommand>}
     */
    #solutionMoves = [];

    constructor(diskDifficult, firstTowerName, middleTowerName, lastTowerName) {
        this.#buildSolutionMoves(diskDifficult, firstTowerName, middleTowerName, lastTowerName);
    }

    hasMoveCommands = () => {
        return this.#solutionMoves.length > 0;
    }

    getNextMoveCommand = () => {
        return this.#solutionMoves.shift();
    }

    #buildSolutionMoves = (diskValue, fromTower, toTower, swapTower) => {
        if (diskValue === 0) return;

        this.#buildSolutionMoves(diskValue - 1, fromTower, swapTower, toTower);

        this.#solutionMoves.push(new MoveCommand(
            diskValue,
            fromTower,
            toTower
        ));

        this.#buildSolutionMoves(diskValue - 1, swapTower, toTower, fromTower);
    }
}

export {HanoiTowerSolver}