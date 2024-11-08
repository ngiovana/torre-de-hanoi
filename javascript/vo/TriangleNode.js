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

    setCounters = (leftCount, topCount, rightCount) => {
        this.leftCount = leftCount;
        this.topCount = topCount;
        this.rightCount = rightCount;
    }

}

export {TriangleNode}