import {Tower} from "../vo/Tower.js";
import {TowerName} from "../enum/TowerName.js";
import {GameStateDTO} from "../dto/GameStateDTO.js";
import {GameData} from "../vo/GameData.js";

class HanoiTowerBuilder {

    static MIN_DIFFICULT_LEVEL = 1
    static MAX_DIFFICULT_LEVEL = 8

    static buildNewGame = (id, playerName, externalDifficultLevel) => {
        const difficultLevel = this.#calculateDifficultLevel(externalDifficultLevel)

        const towerByNameObject = HanoiTowerBuilder.#buildTowerByTowerNameObject(difficultLevel);
        const disksByTowerObject = HanoiTowerBuilder.#buildDisksByTowerObject(towerByNameObject);

        const gameState = new GameStateDTO(id, towerByNameObject, disksByTowerObject)

        const gameData = new GameData(
            id,
            playerName,
            difficultLevel,
            HanoiTowerBuilder.#calculateMinMovesToWin(difficultLevel),
            gameState
        );

        Object.freeze(gameData);

        return gameData;
    }

    static #buildTowerByTowerNameObject = (diskQuantity) => {
        const towerByNameObject = {};
        Object.values(TowerName).forEach((towerName, index) => {
            const diskStack = towerName === TowerName.FIRST_TOWER
                ? HanoiTowerBuilder.#buildDiskStack(diskQuantity)
                : [];

            towerByNameObject[towerName] = new Tower(towerName, index, diskStack);
        });

        return towerByNameObject;
    }

    static #buildDiskStack = (diskQuantity) => {
        const diskStack = []
        for (let diskNumber = diskQuantity; diskNumber > 0; diskNumber--) {
            diskStack.push(diskNumber)
        }

        return diskStack
    }

    static #buildDisksByTowerObject = (towerByNameObject) => {
        const disksByTowerObject = {};

        Object.values(towerByNameObject).forEach((tower) => {
            const diskStack = tower.getDiskStack();

            disksByTowerObject[tower.id] = diskStack;
            disksByTowerObject[tower.name] = diskStack;
        });

        return disksByTowerObject;
    }

    static #calculateDifficultLevel = (difficultLevel) => {
        if (isNaN(difficultLevel) || difficultLevel === '') {
            return HanoiTowerBuilder.MAX_DIFFICULT_LEVEL;
        }

        return Math.min(
            HanoiTowerBuilder.MAX_DIFFICULT_LEVEL,
            Math.max(difficultLevel, HanoiTowerBuilder.MIN_DIFFICULT_LEVEL)
        );
    }

    static #calculateMinMovesToWin = (difficultLevel) => {
        return Math.pow(2, difficultLevel) - 1
    };

}

export {HanoiTowerBuilder}