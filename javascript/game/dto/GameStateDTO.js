import {TowerName} from "../enum/TowerName.js";

class GameStateDTO {

    id;
    movesCount;
    bestMovesCount;
    isFinished;
    isBestSolution;

    towerByName;

    firstTower;
    middleTower;
    lastTower;

    disksByTower;

    constructor(id, towerByName, disksByTower) {
        this.id = id;

        this.movesCount = 0;
        this.bestMovesCount = 0;
        this.isFinished = false;
        this.isBestSolution = false;

        this.towerByName = towerByName;

        this.firstTower = towerByName[TowerName.FIRST_TOWER];
        this.middleTower = towerByName[TowerName.MIDDLE_TOWER];
        this.lastTower = towerByName[TowerName.LAST_TOWER];

        this.disksByTower = disksByTower;
    }

    getTowerByName = (towerName) => {
        return this.towerByName[towerName];
    }

    getTowerList = () => {
        return [
            this.firstTower.getDiskStack().map(disk => disk - 1),
            this.middleTower.getDiskStack().map(disk => disk - 1),
            this.lastTower.getDiskStack().map(disk => disk - 1),
        ]
    }

}

export {GameStateDTO}