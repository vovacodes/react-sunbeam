import { BoundingBox, Direction } from "./types.js"
import { boxesWithinFrustumOfOrigin } from "./frustumFilteringUtils.js"
import absurd from "../shared/absurd.js"

function getMinkowskiDifference(boxA: BoundingBox, boxB: BoundingBox): BoundingBox {
    const left = boxA.left - boxB.right
    const top = boxA.top - boxB.bottom
    const width = boxA.right - boxA.left + (boxB.right - boxB.left)
    const height = boxA.bottom - boxA.top + (boxB.bottom - boxB.top)

    return {
        left,
        right: left + width,
        top,
        bottom: top + height,
    }
}

function isColliding(minkowskiDifferenceBox: BoundingBox): boolean {
    const { left, right, top, bottom } = minkowskiDifferenceBox
    // the A and B are colliding if their minkowski difference
    // contains the origin point (0, 0)
    if (left <= 0 && right > 0 && top < 0 && bottom > 0) {
        return true
    }

    return false
}

function getDistance(minkowskiDifferenceBox: BoundingBox): number {
    if (isColliding(minkowskiDifferenceBox)) {
        return 0
    }

    const { left, right, top, bottom } = minkowskiDifferenceBox

    // distance from origin to the minkowski diff box of A and B
    // is the distance between A and B

    const dx = Math.max(left, 0, -right)
    const dy = Math.max(top, 0, -bottom)

    return Math.sqrt(dx * dx + dy * dy)
}

function getDistanceFromMiddleOfOriginEdgeToBox(origin: BoundingBox, box: BoundingBox, direction: Direction): number {
    const originHalfWidth = (origin.right - origin.left) / 2
    const originHalfHeight = (origin.bottom - origin.top) / 2

    let midEdge
    let closestPointOfBox
    if (direction === Direction.LEFT) {
        midEdge = { x: origin.left, y: origin.top + originHalfHeight }

        if (box.bottom < midEdge.y) {
            closestPointOfBox = { x: box.right, y: box.bottom }
        } else if (box.top > midEdge.y) {
            closestPointOfBox = { x: box.right, y: box.top }
        } else {
            // projection point
            closestPointOfBox = { x: box.right, y: midEdge.y }
        }
    } else if (direction === Direction.RIGHT) {
        midEdge = { x: origin.right, y: origin.top + originHalfHeight }

        if (box.bottom < midEdge.y) {
            closestPointOfBox = { x: box.left, y: box.bottom }
        } else if (box.top > midEdge.y) {
            closestPointOfBox = { x: box.left, y: box.top }
        } else {
            // projection point
            closestPointOfBox = { x: box.left, y: midEdge.y }
        }
    } else if (direction === Direction.UP) {
        midEdge = { x: origin.left + originHalfWidth, y: origin.top }

        if (box.right < midEdge.x) {
            closestPointOfBox = { x: box.right, y: box.bottom }
        } else if (box.left > midEdge.x) {
            closestPointOfBox = { x: box.left, y: box.bottom }
        } else {
            // projection point
            closestPointOfBox = { x: midEdge.x, y: box.bottom }
        }
    } else if (direction === Direction.DOWN) {
        midEdge = { x: origin.left + originHalfWidth, y: origin.bottom }

        if (box.right < midEdge.x) {
            closestPointOfBox = { x: box.right, y: box.top }
        } else if (box.left > midEdge.x) {
            closestPointOfBox = { x: box.left, y: box.top }
        } else {
            // projection point
            closestPointOfBox = { x: midEdge.x, y: box.top }
        }
    } else {
        midEdge = absurd(direction)
        closestPointOfBox = absurd(direction)
    }

    const dx = Math.abs(midEdge.x - closestPointOfBox.x)
    const dy = Math.abs(midEdge.y - closestPointOfBox.y)

    return Math.sqrt(dx * dx + dy * dy)
}

export default function getBestCandidate(
    origin: BoundingBox,
    candidates: readonly BoundingBox[],
    direction: Direction
): BoundingBox | null {
    if (candidates.length === 0) return null

    const candidatesWithinFrustum = boxesWithinFrustumOfOrigin(candidates, origin, direction)
    if (candidatesWithinFrustum.length === 0) return null

    const [bestCandidates] = candidatesWithinFrustum.reduce<[BoundingBox[], number]>(
        (result, candidate) => {
            const [closestCandidates, shortestDistance] = result

            const distance = getDistance(getMinkowskiDifference(origin, candidate))

            if (distance > shortestDistance) return result

            if (distance === shortestDistance) {
                closestCandidates.push(candidate)
                return result
            }

            return [[candidate], distance]
        },
        [[], Number.POSITIVE_INFINITY]
    )

    if (bestCandidates.length <= 1) {
        return bestCandidates[0]
    }

    //   calculate distance between the mid-point of the origin
    //   box's edge in the direction of focus move and each bestCandidate.
    //   The closest one wins, if there are several pick the first one.
    const [theVeryBestCandidate] = bestCandidates.reduce<[BoundingBox | null, number]>(
        (result, candidate) => {
            const [_closestCandidates, shortestDistance] = result

            const distance = getDistanceFromMiddleOfOriginEdgeToBox(origin, candidate, direction)

            if (distance >= shortestDistance) return result

            return [candidate, distance]
        },
        [null, Number.POSITIVE_INFINITY]
    )

    return theVeryBestCandidate
}
