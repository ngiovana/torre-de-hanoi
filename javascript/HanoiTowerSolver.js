import {MoveCommand} from "./MoveCommand.js";
import { TowerName } from "./TowerName.js";

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

    buildNextSolutionMove = (towers, numDisks, towerFrom, towerTo, towerAux) => {
        if (numDisks < 1) {
            return;
        }

        let currentFrom = null;
        for (let i = 0; i < 3; i++) {
            const tower = towers[i];
            if (tower.length > 0 && tower[numDisks - tower.length]?.value === numDisks) {
                currentFrom = i;
                break;
            }
        }

        if (currentFrom == null) {
            return;
        }

        let currentAux = (currentFrom === towerFrom) ? towerAux : towerFrom;
        let currentTo = (currentFrom === towerAux) ? towerTo : towerAux;

        if (numDisks > 1) {
            this.buildNextSolutionMove(towers, numDisks - 1, currentFrom, currentAux, currentTo);
        }

        const nextDisk = towers[currentFrom].pop(); // Remover disco da torre de origem
        towers[towerTo].push(nextDisk); // Adicionar disco à torre de destino

        this.#solutionMoves.push({
            diskValue: numDisks,
            fromTowerName: Object.values(TowerName)[currentFrom],
            toTowerName: Object.values(TowerName)[towerTo]
        });

        if (numDisks > 1) {
            this.buildNextSolutionMove(towers, numDisks - 1, currentAux, towerTo, towerFrom);
        }
    }
}

export {HanoiTowerSolver}