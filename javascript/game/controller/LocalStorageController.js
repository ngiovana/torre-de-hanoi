const userGameDataKey = "lastGameData"

class LocalStorageController {

    static saveLastGameData(id, username, score) {
        const gameData = { id: id, username: username, score: score };
        localStorage.setItem(userGameDataKey, JSON.stringify(gameData));
    }

    static getLastGameData() {
        const stringGameData = localStorage.getItem(userGameDataKey);
        if (!stringGameData) return null

        return JSON.parse(stringGameData);
    }

}

export {LocalStorageController}
