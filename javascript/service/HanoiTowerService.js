import {TowerVO} from "../vo/TowerVO.js";
import {DiskVO} from "../vo/DiskVO.js";
import {HanoiTowerSolver} from "../utils/HanoiTowerSolver.js";
import {TowerName} from "../enum/TowerName.js";

class HanoiTowerService {

    static MAX_DISK_DIFFICULT = 8

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

    startGame = (diskDifficult) => {
        diskDifficult = Math.min(diskDifficult, HanoiTowerService.MAX_DISK_DIFFICULT);

        this.minMovesToFinish = this.#calculateMinMovesToFinish(diskDifficult)
        this.movesCount = 0
        this.diskDifficult = diskDifficult
        this.isFinished = false

        const diskStack = []
        for (let counter = diskDifficult; counter > 0; counter--) {
            const disk = new DiskVO(counter)
            diskStack.push(disk)
        }

        this.firstTower = new TowerVO(TowerName.FIRST_TOWER, 0, diskStack);
        this.middleTower = new TowerVO(TowerName.MIDDLE_TOWER, 1, []);
        this.lastTower = new TowerVO(TowerName.LAST_TOWER, 2, []);

        this.#solver = new HanoiTowerSolver(diskDifficult, ...Object.values(TowerName))
    };

    checkMoveCommand = (moveCommand) => {
        if (this.#validateMoveCommand(moveCommand)) {
            this.#executeMoveCommand(moveCommand);
            return true;
        }

        return false
    };

    requestHint = () => {
        if (this.isFinished) return;

        const towers = this.#buildTowersDiskObject();
        this.#solver.buildNextSolutionMove(towers, this.diskDifficult, 0, 2, 1);

        if (!this.#solver.hasMoveCommands()) return;

        const moveCommand = this.#solver.getNextMoveCommand();
        if (this.checkMoveCommand(moveCommand)) {
            return moveCommand;
        }
    };

    isWinWithBestSolution = () => {
        return this.movesCount === this.minMovesToFinish;
    };

    #incrementMovesCount = () => {
        this.movesCount++;
    };

    #calculateMinMovesToFinish = (diskDifficult) => {
        return Math.pow(2, diskDifficult) - 1
    };

    #findTowerByName = (towerName) => {
        return this[towerName];
    };

    #validateMoveCommand = (moveCommand) => {
        if (this.isFinished) return false;

        const fromTower = this.#findTowerByName(moveCommand.fromTowerName);
        if (!fromTower) return false;

        const disk = fromTower.getTopDisk()
        if (disk.getValue() !== moveCommand.diskValue) return false;

        const toTower = this.#findTowerByName(moveCommand.toTowerName);
        if (!toTower) return false;

        if (fromTower === toTower) return false;

        const currentTopDisk = toTower.getTopDisk();
        if (!currentTopDisk) return true;

        return currentTopDisk.getValue() > disk.getValue();
    };

    #executeMoveCommand = (moveCommand) => {
        const fromTower = this.#findTowerByName(moveCommand.fromTowerName);
        const disk = fromTower.getTopDisk()
        const toTower = this.#findTowerByName(moveCommand.toTowerName);

        fromTower.removeTopDisk();
        toTower.addDisk(disk);

        this.#incrementMovesCount();
        this.#checkWin()
    };

    #checkWin = () => {
        if (this.#validateWin()) {
            this.isFinished = true;
        }
    };

    #validateWin = () => {
        return [this.middleTower, this.lastTower].some(tower => {
            return tower.size() === this.diskDifficult;
        });
    }

    #buildTowersDiskObject = () => {
        const towersDiskObject = {};

        Object.values(TowerName).forEach((towerName) => {
            const tower = this.#findTowerByName(towerName);
            towersDiskObject[tower.id] = tower.getDiskStack();
            towersDiskObject[towerName] = tower.getDiskStack();
        });

        return towersDiskObject;
    }
}

export {HanoiTowerService}