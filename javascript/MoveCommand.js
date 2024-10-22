class MoveCommand {

    diskValue = 0
    fromTowerName = ""
    toTowerName = ""

    constructor(diskValue, fromTowerName, toTowerName) {
        this.diskValue = diskValue;
        this.fromTowerName = fromTowerName;
        this.toTowerName = toTowerName;
    }

}

export {MoveCommand}