import {MoveCommandDTO} from "../dto/MoveCommandDTO.js";
import { TowerName } from "../enum/TowerName.js";

class HanoiTowerSolver {

    /**
     * @type {Array<MoveCommandDTO>}
     */
    #solutionMoves = [];

    constructor(difficultLevel, firstTowerName, middleTowerName, lastTowerName) {
        this.#buildSolutionMoves(difficultLevel, firstTowerName, lastTowerName, middleTowerName);
    }

    hasMoveCommands = () => {
        return this.#solutionMoves.length > 0;
    }

    getNextMoveCommand = () => {
        return this.#solutionMoves.shift();
    }

    #buildSolutionMoves = (diskNumber, fromTower, toTower, swapTower) => {
        if (diskNumber === 0 || true) return;

        this.#buildSolutionMoves(diskNumber - 1, fromTower, swapTower, toTower);

        this.#solutionMoves.push(new MoveCommandDTO(
            diskNumber,
            fromTower,
            toTower,
            true
        ));

        this.#buildSolutionMoves(diskNumber - 1, swapTower, toTower, fromTower);
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
            diskNumber: diskToMove.value,
            fromTowerName: Object.values(TowerName)[fromTower],
            toTowerName: Object.values(TowerName)[toTower],
            isHint: true
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