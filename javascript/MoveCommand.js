class MoveCommand {

    diskValue
    fromTowerName
    toTowerName

    constructor(diskValue, fromTowerName, toTowerName) {
        this.diskValue = diskValue;
        this.fromTowerName = fromTowerName;
        this.toTowerName = toTowerName;
    }

}

export {MoveCommand}