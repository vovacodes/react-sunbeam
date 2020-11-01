import { BoundingBox, Direction } from "./types.js"
import absurd from "../shared/absurd.js"

// ax + bx + c = 0
interface Line {
    a: number
    b: number
    c: number
}

export function boxesWithinFrustumOfOrigin(
    boundingBoxes: readonly BoundingBox[],
    origin: BoundingBox,
    direction: Direction
): BoundingBox[] {
    switch (direction) {
        case Direction.UP:
            return boundingBoxes.filter(isWithinTopFrustumOf(origin))
        case Direction.RIGHT:
            return boundingBoxes.filter(isWithinRightFrustumOf(origin))
        case Direction.DOWN:
            return boundingBoxes.filter(isWithinBottomFrustumOf(origin))
        case Direction.LEFT:
            return boundingBoxes.filter(isWithinLeftFrustumOf(origin))
        default:
            return absurd(direction)
    }
}

function isWithinTopFrustumOf(originBox: BoundingBox) {
    return (testBox: BoundingBox): boolean => {
        // test for Y-axis intersection

        if (testBox.top > originBox.top) return false

        // test for X-axis intersection

        const leftFrustumEdge = getTopLeftFrustumEdge(originBox)
        const rightFrustumEdge = getTopRightFrustumEdge(originBox)

        // solve left frustum edge line equation for y = testBox.top
        const frustumXMin = (-leftFrustumEdge.b * testBox.top - leftFrustumEdge.c) / leftFrustumEdge.a

        if (testBox.right <= frustumXMin) return false

        // solve right frustum edge line equation for y = testBox.top
        const frustumXMax = (-rightFrustumEdge.b * testBox.top - rightFrustumEdge.c) / rightFrustumEdge.a

        if (testBox.left >= frustumXMax) return false

        return true
    }
}

function isWithinRightFrustumOf(originBox: BoundingBox) {
    return (testBox: BoundingBox): boolean => {
        // test for X-axis intersection

        if (testBox.right < originBox.right) return false

        // test for Y-axis intersection

        const topFrustumEdge = getTopRightFrustumEdge(originBox)
        const bottomFrustumEdge = getBottomRightFrustumEdge(originBox)

        // solve top frustum edge line equation for x = testBox.right
        const frustumYMin = (-topFrustumEdge.a * testBox.right - topFrustumEdge.c) / topFrustumEdge.b

        if (testBox.bottom <= frustumYMin) return false

        // solve bottom frustum edge line equation for x = testBox.right
        const frustumYMax = (-bottomFrustumEdge.a * testBox.right - bottomFrustumEdge.c) / bottomFrustumEdge.b

        if (testBox.top >= frustumYMax) return false

        return true
    }
}

function isWithinBottomFrustumOf(originBox: BoundingBox) {
    return (testBox: BoundingBox): boolean => {
        // test for Y-axis intersection

        if (testBox.bottom < originBox.bottom) return false

        // test for X-axis intersection

        const leftFrustumEdge = getBottomLeftFrustumEdge(originBox)
        const rightFrustumEdge = getBottomRightFrustumEdge(originBox)

        // solve left frustum edge line equation for y = testBox.bottom
        const frustumXMin = (-leftFrustumEdge.b * testBox.bottom - leftFrustumEdge.c) / leftFrustumEdge.a

        if (testBox.right <= frustumXMin) return false

        // solve right frustum edge line equation for y = testBox.bottom
        const frustumXMax = (-rightFrustumEdge.b * testBox.bottom - rightFrustumEdge.c) / rightFrustumEdge.a

        if (testBox.left >= frustumXMax) return false

        return true
    }
}

function isWithinLeftFrustumOf(originBox: BoundingBox) {
    return (testBox: BoundingBox): boolean => {
        // test for X-axis intersection

        if (testBox.left > originBox.left) return false

        // test for Y-axis intersection

        const topFrustumEdge = getTopLeftFrustumEdge(originBox)
        const bottomFrustumEdge = getBottomLeftFrustumEdge(originBox)

        // solve top frustum edge line equation for x = testBox.left
        const frustumYMin = (-topFrustumEdge.a * testBox.left - topFrustumEdge.c) / topFrustumEdge.b

        if (testBox.bottom <= frustumYMin) return false

        // solve bottom frustum edge line equation for x = testBox.left
        const frustumYMax = (-bottomFrustumEdge.a * testBox.left - bottomFrustumEdge.c) / bottomFrustumEdge.b

        if (testBox.top >= frustumYMax) return false

        return true
    }
}

function getTopLeftFrustumEdge(box: BoundingBox): Line {
    // top-left frustum edge is a line that goes
    // through (box.left, box.top) point
    // and makes a 45 degrees angle with X axis
    // so the line equation for it has a form of:
    //
    // x - y + c = 0
    //
    // knowing a point on this line: x = box.left; y = box.top
    // we can calculate `c`:
    return {
        a: 1,
        b: -1,
        c: box.top - box.left,
    }
}

function getTopRightFrustumEdge(box: BoundingBox): Line {
    // top-right frustum edge is a line that goes
    // through (box.right, box.top) point
    // and makes a -45 degrees angle with X axis
    // so the line equation for it has a form of:
    //
    // x + y + c = 0
    //
    // knowing a point on this line: x = box.right; y = box.top
    // we can calculate `c`:
    return {
        a: 1,
        b: 1,
        c: -(box.right + box.top),
    }
}

function getBottomRightFrustumEdge(box: BoundingBox): Line {
    // bottom-right frustum edge is a line that goes
    // through (box.right, box.bottom) point
    // and makes a 45 degrees angle with X axis
    // so the line equation for it has a form of:
    //
    // x - y + c = 0
    //
    // knowing a point on this line: x = box.right; y = box.bottom
    // we can calculate `c`:
    return {
        a: 1,
        b: -1,
        c: box.bottom - box.right,
    }
}

function getBottomLeftFrustumEdge(box: BoundingBox): Line {
    // bottom-left frustum edge is a line that goes
    // through (box.left, box.bottom) point
    // and makes a -45 degrees angle with X axis
    // so the line equation for it has a form of:
    //
    // x + y + c = 0
    //
    // knowing a point on this line: x = box.left; y = box.bottom
    // we can calculate `c`:
    return {
        a: 1,
        b: 1,
        c: -(box.left + box.bottom),
    }
}
