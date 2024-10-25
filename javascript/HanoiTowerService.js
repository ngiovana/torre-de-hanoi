import {Tower} from "./Tower.js";
import {Disk} from "./Disk.js";
import {HanoiTowerController} from "./HanoiTowerController.js";
import {HanoiTowerSolver} from "./HanoiTowerSolver.js";
import {TowerName} from "./TowerName.js";

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
    static instance;

    constructor(screenController) {
        this.#screenController = screenController;
        this.instance = this;
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

        this.firstTower = new Tower(TowerName.FIRST_TOWER, 0, diskStack);
        this.middleTower = new Tower(TowerName.MIDDLE_TOWER, 1, []);
        this.lastTower = new Tower(TowerName.LAST_TOWER, 2, []);

        this.#solver = new HanoiTowerSolver(diskDifficult, ...Object.values(TowerName))
    };

    checkMoveCommand = (moveCommand) => {
        if (this.validateMoveCommand(moveCommand)) {
            this.#executeMoveCommand(moveCommand);
            return true;
        }

        return false
    };

    findBiggerTower = (towers) => {
        let biggerTower = towers[0];
        let index = 0;
        for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
            if (towers[towerIndex].length > biggerTower.length) {
                biggerTower = towers[towerIndex];
                index = towerIndex;
            }
        }

        return index;
    };

    findSmallerTower = (towers) => {
        let smallerTower = towers[0];
        let index = 1;
        for (let towerIndex = 0; towerIndex < 3; towerIndex++) {
            if (towers[towerIndex].length < smallerTower.length) {
                smallerTower = towers[towerIndex];
                index = towerIndex;
            }
        }

        return index;
    };

    executeHint = () => {
        if (this.isFinished) return;

        const towers = this.#buildTowersDiskObject();
        // this.#solver.setTowers(towers);
        // const biggerTower = this.findBiggerTower(towers);
        // const smallerTower = this.findSmallerTower(towers);
        // const middleTower = 3 - biggerTower - smallerTower;
        // this.#solver.buildNextSolutionMove(towers, this.diskDifficult, biggerTower, smallerTower, middleTower);

        const towersArray = Object.values(towers);
        this.#solver.needStop = false;
        this.#solver.determineNextMove(towersArray, this.diskDifficult, 0, 2, 1);

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

    #findTowerByName = (towerName) => {
        return this[towerName];
    };

    validateMoveCommand = (moveCommand) => {
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

    #buildTowersDiskObject = () => {
        const towersDiskObject = {};

        Object.values(TowerName).forEach((towerName) => {
            const tower = this.#findTowerByName(towerName);
            towersDiskObject[tower.id] = tower.getDiskStack();
            // towersDiskObject[tow erName] = tower.getDiskStack();
        });

        return towersDiskObject;
    }
}

export {HanoiTowerService}