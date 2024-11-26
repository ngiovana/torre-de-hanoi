import {HanoiTowerBuilder} from "../utils/HanoiTowerBuilder.js";
import {Utils} from "../utils/Utils.js";

class HanoiTowerService {

    #currentGames = {};

    startGame = (playerName, externalDifficultLevel) => {
        const gameId = Utils.generateUUID();

        const gameData = HanoiTowerBuilder.buildNewGame(gameId, playerName, externalDifficultLevel);
        this.#currentGames[gameId] = gameData;

        return Utils.deepClone(gameData);
    };

    checkMoveCommand = (moveCommand) => {
        const gameData = this.#currentGames[moveCommand.gameId];
        if (!gameData) return;

        if (HanoiTowerService.#validateMoveCommand(gameData, moveCommand)) {
            HanoiTowerService.#executeMoveCommand(gameData, moveCommand);
            return Utils.deepClone(gameData.state);
        }
    };

    requestHint = (gameId) => {
        const gameData = this.#currentGames[gameId];
        if (!gameData) return;
        if (gameData.state.isFinished) return;

        gameData.state.hintsCount++;

        const moveCommand = gameData.solver.getNextMoveCommand(gameData.state);
        if (!moveCommand) return;

        if (HanoiTowerService.#validateMoveCommand(gameData, moveCommand)) {
            return Utils.deepClone(moveCommand);
        }
    };

    getGameScore = (gameId) => {
        const gameData = this.#currentGames[gameId];
        if (!gameData) return 0;

        return gameData.calculateScore()
    }

    static #validateMoveCommand = (gameData, moveCommand) => {
        if (gameData.state.isFinished) return false;

        const fromTower = gameData.state.getTowerByName(moveCommand.fromTowerName);
        if (!fromTower) return false;

        const disk = fromTower.getTopDisk()
        if (disk !== moveCommand.diskNumber) return false;

        const toTower = gameData.state.getTowerByName(moveCommand.toTowerName);
        if (!toTower) return false;

        if (fromTower === toTower) return false;

        const currentTopDisk = toTower.getTopDisk();
        if (!currentTopDisk) return true;

        return currentTopDisk > disk;
    };

    static #executeMoveCommand = (gameData, moveCommand) => {
        const fromTower = gameData.state.getTowerByName(moveCommand.fromTowerName);
        const disk = fromTower.getTopDisk()
        const toTower = gameData.state.getTowerByName(moveCommand.toTowerName);

        const hintMoveCommand = gameData.solver.getNextMoveCommand(gameData.state);
        if (hintMoveCommand) {
            if (JSON.stringify(Object.assign({}, moveCommand,  {isHint: true}) ) === JSON.stringify(hintMoveCommand)) {
                gameData.state.bestMovesCount++;
            }
        }

        fromTower.removeTopDisk();
        toTower.addDisk(disk);

        gameData.state.movesCount++;

        if (HanoiTowerService.#validateWin(gameData)) {
            gameData.state.isFinished = true;
            gameData.state.isBestSolution = gameData.state.movesCount === gameData.minMoves;
            gameData.timer.stop()
        }
    };

    static #validateWin = (gameData) => {
        return [gameData.state.middleTower, gameData.state.lastTower].some(tower => {
            return tower.size() === gameData.difficultLevel;
        });
    }

}

export {HanoiTowerService}