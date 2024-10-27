import {TowerName} from "../enum/TowerName.js";

class GameStateDTO {

    id;
    movesCount;
    isFinished;

    towerDisks;
    firstTower;
    middleTower;
    lastTower;

    constructor(id, towerDisks) {
        this.id = id;

        this.movesCount = 0;
        this.isFinished = false;

        this.towerDisks = towerDisks;
        this.firstTower = towerDisks[TowerName.FIRST_TOWER];
        this.middleTower = towerDisks[TowerName.MIDDLE_TOWER];
        this.lastTower = towerDisks[TowerName.LAST_TOWER];
    }

}

export {GameStateDTO}