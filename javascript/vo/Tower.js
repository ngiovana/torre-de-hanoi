import {DiskVO} from "./DiskVO.js";

class TowerVO {

    id
    name
    diskStack;

    constructor(name, id, diskStack) {
        this.name = name
        this.id = id
        this.diskStack = diskStack;
    }

    getDiskStack = () => {
        return JSON.parse(JSON.stringify(this.diskStack));
    };

    getTopDisk = () => {
        return this.diskStack[this.diskStack.length - 1]
    };

    addDisk = (disk) => {
        this.diskStack.push(disk);
    };

    removeTopDisk = () => {
        this.diskStack.pop();
    };

    size = () => {
        return this.diskStack.length
    };

}

export {TowerVO}