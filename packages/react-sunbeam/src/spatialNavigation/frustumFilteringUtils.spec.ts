import { isWithinTopFrustumOf } from "./frustumFilteringUtils"

describe("isWithinTopFrustumOf", () => {
    const originBox = {
        top: 100,
        bottom: 300,
        left: 100,
        right: 500,
    }

    it("should return `true` for the boxes that are entirely withing the top frustum", () => {
        const testBoxes = [
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

        for (const testBox of testBoxes) {
            expect(isWithinTopFrustumOf(originBox)(testBox)).toBe(true)
        }
    })
})
