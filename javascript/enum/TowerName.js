const TowerName = {
    FIRST_TOWER: "firstTower",
    MIDDLE_TOWER: "middleTower",
    LAST_TOWER: "lastTower",

    towerIndexToName: (index) => {
        const towerNames = Object.values(TowerName);
        return towerNames[index] || null;
    }
}

Object.freeze(TowerName)

export {TowerName}