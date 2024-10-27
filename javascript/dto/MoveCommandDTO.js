class MoveCommandDTO {

    gameId
    diskNumber
    fromTowerName
    toTowerName
    isHint

    constructor(gameId, diskNumber, fromTowerName, toTowerName, isHint) {
        this.gameId = gameId;
        this.diskNumber = diskNumber;
        this.fromTowerName = fromTowerName;
        this.toTowerName = toTowerName;
        this.isHint = isHint;
    }

}

export {MoveCommandDTO}