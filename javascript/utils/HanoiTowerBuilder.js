import {TowerVO} from "../vo/TowerVO.js";
import {DiskVO} from "../vo/DiskVO.js";
import {TowerName} from "../enum/TowerName.js";
import {GameStateDTO} from "../dto/GameStateDTO";
import {GameDataVO} from "../vo/GameDataVO";

class HanoiTowerBuilder {

    static MIN_DIFFICULT_LEVEL = 1
    static MAX_DIFFICULT_LEVEL = 8

    static buildNewGame = (id, playerName, externalDifficultLevel) => {
        const difficultLevel = this.#calculateDifficultLevel(externalDifficultLevel)
        const towersDisksObject = HanoiTowerBuilder.#buildTowersDisksObject(difficultLevel);
        const gameState = new GameStateDTO(id, towersDisksObject)

        const gameData = new GameDataVO(
            id,
            playerName,
            difficultLevel,
            HanoiTowerBuilder.#calculateMinMovesToWin(difficultLevel),
            gameState
        );

        Object.freeze(gameData);

        return gameData;
    }

    static #buildTowersDisksObject = (diskQuantity) => {
        const towersDisksObject = {};
        Object.values(TowerName).forEach((towerName, index) => {
            const diskStack = towerName === TowerName.FIRST_TOWER
                ? HanoiTowerBuilder.#buildDiskStack(diskQuantity)
                : [];

            const tower = new TowerVO(towerName, index, diskStack)
            towersDisksObject[tower.id] = tower;
            towersDisksObject[tower.name] = tower;
        });

        return towersDisksObject;
    }

    static #buildDiskStack = (diskQuantity) => {
        const diskStack = []
        for (let diskNumber = diskQuantity; diskNumber > 0; diskNumber--) {
            const disk = new DiskVO(diskNumber)
            diskStack.push(disk)
        }

        return diskStack
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