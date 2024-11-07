class TriangleNode {

    position;
    bestPosition;
    middlePosition;
    worstPosition;

    leftCount;
    topCount;
    rightCount;

    constructor(position) {
        this.position = position;
    }

    setCounters = (leftCount, topCount, rightCount) => {
        this.leftCount = leftCount;
        this.topCount = topCount;
        this.rightCount = rightCount;
    }

}

export {TriangleNode}