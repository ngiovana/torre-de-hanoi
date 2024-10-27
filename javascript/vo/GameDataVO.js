import {Timer} from "../utils/Timer.js";
import {HanoiTowerSolver} from "../utils/HanoiTowerSolver.js";
import {TowerName} from "../enum/TowerName.js";

class GameDataVO {

    id;
    playerName;
    difficultLevel;
    minMoves;
    state;

    solver;
    timer;

    constructor(id, playerName, difficultLevel, minMoves, state) {
        this.id = id
        this.playerName = playerName
        this.difficultLevel = difficultLevel
        this.minMoves = minMoves
        this.state = state

        this.solver = new HanoiTowerSolver(difficultLevel, ...Object.values(TowerName))
        this.timer = new Timer();
    }

}

export {GameDataVO}