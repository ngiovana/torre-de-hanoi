const TowerName = {
    FIRST_TOWER: "firstTower",
    MIDDLE_TOWER: "middleTower",
    LAST_TOWER: "lastTower",
}

Object.freeze(TowerName)

const towerIndexToName = (index) => {
    const towerNames = Object.values(TowerName);
    return towerNames[index] || null;
}

export {TowerName}