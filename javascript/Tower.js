import {Disk} from "./Disk.js";

class Tower {

    name

    /**
     * @type {Array<Disk>}
     */
    diskStack;

    constructor(name, diskStack) {
        this.name = name
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

export {Tower}