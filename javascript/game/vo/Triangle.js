import {TriangleNode} from "./TriangleNode.js";

class Triangle {

    /**
     * @type {Triangle}
     */
    left;

    /**
     * @type {Triangle}
     */
    top;

    /**
     * @type {Triangle}
     */
    right;

    /**
     * @type {TriangleNode}
     */
    leftNode;

    /**
     * @type {TriangleNode}
     */
    rightNode;

    /**
     * @type {TriangleNode}
     */
    topNode;

}

export {Triangle}