import {addMoveToQueue, hanoiSolver, solutionMoves} from './solver.js';
import {Tower} from "./Tower.js";
import {Disk} from "./Disk.js";
import {HanoiTowerController} from "./HanoiTowerController.js";

class HanoiTowerService {

    static MAX_DISK_DIFFICULT = 8

    /**
     * @type {HanoiTowerController}
     */
    #screenController;

    minMovesToFinish;
    movesCount;
    diskDifficult;
    isFinished;

    firstTower;
    middleTower;
    lastTower;

    constructor(screenController) {
        this.#screenController = screenController;
    }

    startGame = (diskDifficult) => {
        diskDifficult = Math.min(diskDifficult, HanoiTowerService.MAX_DISK_DIFFICULT);

        this.minMovesToFinish = this.#calculateMinMovesToFinish(diskDifficult)
        this.movesCount = 0
        this.diskDifficult = diskDifficult
        this.isFinished = false

        const diskStack = []
        for (let counter = diskDifficult; counter > 0; counter--) {
            const disk = new Disk(counter)
            diskStack.push(disk)
        }

        this.firstTower = new Tower("firstTower", diskStack);
        this.middleTower = new Tower("middleTower", []);
        this.lastTower = new Tower( "lastTower", []);

        solutionMoves.length = 0;
        hanoiSolver(diskDifficult, 1, 3, 2);
    };

    checkMoveCommand = (moveCommand) => {
        if (this.#validateMoveCommand(moveCommand)) {
            this.#executeMoveCommand(moveCommand);
            return true;
        }

        return false
    };

    executeHint = () => {
        if (this.isFinished) return;

        addMoveToQueue();

        this.#incrementMovesCount();
        setTimeout(() => this.#checkWin(), 100);
    };

    isWinWithBestSolution = () => this.movesCount === this.minMovesToFinish;

    #incrementMovesCount = () => {
        this.movesCount++;
        this.#screenController.updateMovesCount();
    };

    #calculateMinMovesToFinish = (diskDifficult) => {
        return Math.pow(2, diskDifficult) - 1
    };

    #findTowerById = (towerName) => {
        return this[towerName];
    };

    #validateMoveCommand = (moveCommand) => {
        const fromTower = this.#findTowerById(moveCommand.fromTowerId);
        if (!fromTower) return false;

        const disk = fromTower.getTopDisk()
        if (disk.getValue() !== moveCommand.diskValue) return false;

        const toTower = this.#findTowerById(moveCommand.toTowerId);
        if (!toTower) return false;

        if (fromTower === toTower) return false;

        const currentTopDisk = toTower.getTopDisk();
        if (!currentTopDisk) return true;

        return currentTopDisk.getValue() > disk.getValue();
    };

    #executeMoveCommand = (moveCommand) => {
        const fromTower = this.#findTowerById(moveCommand.fromTowerId);
        const disk = fromTower.getTopDisk()
        const toTower = this.#findTowerById(moveCommand.toTowerId);

        fromTower.removeTopDisk();
        toTower.addDisk(disk);

        this.#incrementMovesCount();
        this.#checkWin()
    };

    #checkWin = () => {
        console.log({
            minMovesToFinish: this.minMovesToFinish,
            movesCount: this.movesCount,
            diskDifficult: this.diskDifficult,
            isFinished: this.isFinished,
            firstTower: this.firstTower,
            middleTower: this.middleTower,
            lastTower: this.lastTower
        })

        if (this.#validateWin()) this.#executeWin();
    };

    #validateWin = () => {
        return [this.middleTower, this.lastTower].some(tower => {
            return tower.size() === this.diskDifficult;
        });
    }

    #executeWin = () => {
        this.isFinished = true;
        this.#screenController.executeWin();
    };
}

export {HanoiTowerService}