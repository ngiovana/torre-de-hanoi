import {MoveCommand} from "./MoveCommand.js";
import { TowerName } from "./TowerName.js";

class HanoiTowerSolver {

    /**
     * @type {Array<MoveCommand>}
     */
    #solutionMoves = [];

    constructor(diskDifficult, firstTowerName, middleTowerName, lastTowerName) {
        this.#buildSolutionMoves(diskDifficult, firstTowerName, lastTowerName, middleTowerName);
    }

    hasMoveCommands = () => {
        return this.#solutionMoves.length > 0;
    }

    getNextMoveCommand = () => {
        return this.#solutionMoves.shift();
    }

    #buildSolutionMoves = (diskValue, fromTower, toTower, swapTower) => {
        if (diskValue === 0 || true) return;

        this.#buildSolutionMoves(diskValue - 1, fromTower, swapTower, toTower);

        this.#solutionMoves.push(new MoveCommand(
            diskValue,
            fromTower,
            toTower
        ));

        this.#buildSolutionMoves(diskValue - 1, swapTower, toTower, fromTower);
    }

    buildNextSolutionMove = (towers, n, fromTower, toTower, auxTower) => {
        if (n === 0) return;

        if (towers[toTower][n - 1] && towers[toTower][n - 1].value === n) {
            this.buildNextSolutionMove(towers, n - 1, fromTower, toTower, auxTower);
            return;
        }

        this.buildNextSolutionMove(towers, n - 1, fromTower, auxTower, toTower);

        const diskToMove = towers[fromTower].pop();

        if (!diskToMove) return;

        towers[toTower].push(diskToMove);

        this.#solutionMoves.push({
            diskValue: diskToMove.value,
            fromTowerName: Object.values(TowerName)[fromTower],
            toTowerName: Object.values(TowerName)[toTower]
        });

        // if (this.#solutionMoves.length === 1) {
        //     const moveCommand = this.#solutionMoves.shift();
        //     if (new HanoiTowerService().validateMoveCommand(moveCommand)) {
        //         this.#solutionMoves.push(moveCommand);
        //     } else {
        //         this.buildNextSolutionMove(towers, n, auxTower, toTower, fromTower);
        //     }
        // }

        this.buildNextSolutionMove(towers, n - 1, auxTower, toTower, fromTower);
    }
}

export {HanoiTowerSolver}