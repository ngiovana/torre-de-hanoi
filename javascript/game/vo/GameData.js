import {Timer} from "../utils/Timer.js";
import {HanoiTowerSolver} from "../utils/HanoiTowerSolver.js";
import {TowerName} from "../enum/TowerName.js";

class GameData {

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

        this.solver = new HanoiTowerSolver(id, difficultLevel, ...Object.values(TowerName))
        this.timer = new Timer();
    }

    calculateScore = () => {
        const maxMoves = this.minMoves * 3;

        const movesCount = this.state.movesCount;
        const bestMovesScore = Math.min(this.state.bestMovesCount, this.minMoves) * 100;
        const movesScore = Math.min(movesCount - this.state.bestMovesCount, maxMoves) * 10;

        const scoreList = [bestMovesScore, movesScore];

        const seconds = this.timer.getSeconds()
        if (this.state.isFinished) {
            if (seconds <= this.minMoves) {
                scoreList.push(1000)
            } else if (seconds <= this.minMoves * 3) {
                scoreList.push(700)
            } else if (seconds <= this.minMoves * 5) {
                scoreList.push(400)
            }

            if (movesCount === this.minMoves) {
                scoreList.push(1500)
            } else if (movesCount <= this.minMoves * 1.5) {
                scoreList.push(800)
            } else if (movesCount <= this.minMoves * 2) {
                scoreList.push(400)
            }
        }

        scoreList.push(-this.state.hintsCount * 90)
        scoreList.push(-seconds)

        return Math.max(
            scoreList.reduce((totalScore, score) => totalScore + score, 0),
            0
        );
    }

}

export {GameData}