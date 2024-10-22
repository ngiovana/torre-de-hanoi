import {Tower} from "./Tower.js";
import {Disk} from "./Disk.js";
import {HanoiTowerController} from "./HanoiTowerController.js";
import {HanoiTowerSolver} from "./HanoiTowerSolver.js";

class HanoiTowerService {

    static MAX_DISK_DIFFICULT = 8

    /**
     * @type {HanoiTowerController}
     */
    #screenController;

    /**
     * @type {HanoiTowerSolver}
     */
    #solver

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

        this.#solver = new HanoiTowerSolver(
            diskDifficult,
            "firstTower",
            "middleTower",
            "lastTower"
        )
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
        if (!this.#solver.hasMoveCommands()) return;

        const moveCommand = this.#solver.getNextMoveCommand();
        this.checkMoveCommand(moveCommand)
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
        const fromTower = this.#findTowerById(moveCommand.fromTowerName);
        if (!fromTower) return false;

        const disk = fromTower.getTopDisk()
        if (disk.getValue() !== moveCommand.diskValue) return false;

        const toTower = this.#findTowerById(moveCommand.toTowerName);
        if (!toTower) return false;

        if (fromTower === toTower) return false;

        const currentTopDisk = toTower.getTopDisk();
        if (!currentTopDisk) return true;

        return currentTopDisk.getValue() > disk.getValue();
    };

    #executeMoveCommand = (moveCommand) => {
        const fromTower = this.#findTowerById(moveCommand.fromTowerName);
        const disk = fromTower.getTopDisk()
        const toTower = this.#findTowerById(moveCommand.toTowerName);

        fromTower.removeTopDisk();
        toTower.addDisk(disk);

        this.#screenController.executeMoveCommand(moveCommand);
        this.#incrementMovesCount();
        this.#checkWin()
    };

    #checkWin = () => {
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