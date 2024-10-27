class MoveCommandDTO {

    gameId
    diskNumber
    fromTowerName
    toTowerName
    isHint

    constructor(diskNumber, fromTowerName, toTowerName, isHint) {
        this.diskNumber = diskNumber;
        this.fromTowerName = fromTowerName;
        this.toTowerName = toTowerName;
        this.isHint = isHint;
    }

}

export {MoveCommandDTO}