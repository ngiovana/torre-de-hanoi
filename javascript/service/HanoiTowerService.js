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

        const solver = gameData.solver;
        solver.buildNextSolutionMove(gameData.state.disksByTower, gameData.difficultLevel, 0, 2, 1);

        if (!solver.hasMoveCommands()) return;

        const moveCommand = solver.getNextMoveCommand();
        const gameState = this.checkMoveCommand(moveCommand);

        if (gameState) {
            return Utils.deepClone({gameState: gameState, moveCommand: moveCommand});
        }
    };

    static #validateMoveCommand = (gameData, moveCommand) => {
        if (gameData.state.isFinished) return false;

        const fromTower = gameData.state.getTowerByName(moveCommand.fromTowerName);
        if (!fromTower) return false;

        const disk = fromTower.getTopDisk()
        if (disk.getNumber() !== moveCommand.diskNumber) return false;

        const toTower = gameData.state.getTowerByName(moveCommand.toTowerName);
        if (!toTower) return false;

        if (fromTower === toTower) return false;

        const currentTopDisk = toTower.getTopDisk();
        if (!currentTopDisk) return true;

        return currentTopDisk.getNumber() > disk.getNumber();
    };

    static #executeMoveCommand = (gameData, moveCommand) => {
        const fromTower = gameData.state.getTowerByName(moveCommand.fromTowerName);
        const disk = fromTower.getTopDisk()
        const toTower = gameData.state.getTowerByName(moveCommand.toTowerName);

        fromTower.removeTopDisk();
        toTower.addDisk(disk);

        gameData.state.movesCount++;

        if (HanoiTowerService.#validateWin(gameData.state)) {
            this.isFinished = true;
        }
    };

    static #validateWin = (gameData) => {
        return [gameData.state.middleTower, gameData.state.lastTower].some(tower => {
            return tower.size() === gameData.difficultLevel;
        });
    }

}

export {HanoiTowerService}