class MoveCommandDTO {

    gameId
    diskValue
    fromTowerName
    toTowerName
    isHint

    constructor(diskValue, fromTowerName, toTowerName, isHint) {
        this.diskValue = diskValue;
        this.fromTowerName = fromTowerName;
        this.toTowerName = toTowerName;
        this.isHint = isHint;
    }

}

export {MoveCommandDTO}