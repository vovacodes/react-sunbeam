import { boxesWithinFrustumOfOrigin } from "./frustumFilteringUtils"
import { Direction } from "./types"

describe("isWithinTopFrustumOf", () => {
    const originBox = {
        top: 100,
        bottom: 300,
        left: 100,
        right: 500,
    }

    it("should filter out the boxes that are outside of the top frustum", () => {
        const boxesEntirelyWithinTopFrustum = [
            {
                top: 25,
                bottom: 75,
                left: 75,
                right: 225,
            },
            {
                top: 25,
                bottom: 75,
                left: 100,
                right: 500,
            },
            {
                top: 25,
                bottom: 75,
                left: 374,
                right: 524,
            },
        ]
        const boxesPartiallyWithinTopFrustum = [
            {
                top: 40,
                bottom: 80,
                left: 1,
                right: 41,
            },
            {
                top: 40,
                bottom: 80,
                left: 559,
                right: 599,
            },
        ]
        const boxesOutsideTopFrustum = [
            {
                top: 40,
                bottom: 80,
                left: 0,
                right: 40,
            },
            {
                top: 40,
                bottom: 80,
                left: 560,
                right: 600,
            },
        ]

        expect(
            boxesWithinFrustumOfOrigin(
                [...boxesEntirelyWithinTopFrustum, ...boxesPartiallyWithinTopFrustum, ...boxesOutsideTopFrustum],
                originBox,
                Direction.UP
            )
        ).toEqual([...boxesEntirelyWithinTopFrustum, ...boxesPartiallyWithinTopFrustum])
    })
})
