class TriangleNode {

    disksState;
    betterDisksState;
    relativeDisksState;
    worseDisksState;

    leftCount;
    topCount;
    rightCount;

    constructor(disksState) {
        this.disksState = disksState;
    }

    setCounters = (topCount, rightCount, leftCount) => {
        this.leftCount = leftCount;
        this.topCount = topCount;
        this.rightCount = rightCount;
    }

}

export {TriangleNode}