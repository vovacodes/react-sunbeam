import { isWithinTopFrustumOf } from "./frustumFilteringUtils"

describe("isWithinTopFrustumOf", () => {
    const originBox = {
        top: 100,
        bottom: 300,
        left: 100,
        right: 500,
    }

    it("should return `TRUE` for the boxes that are entirely within the top frustum", () => {
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

    it("should return `TRUE` for the boxes that are at least partially within the top frustum", () => {
        const testBoxes = [
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

        for (const testBox of testBoxes) {
            expect(isWithinTopFrustumOf(originBox)(testBox)).toBe(true)
        }
    })
    it("should return `FALSE` for the boxes that are outside the top frustum", () => {
        const testBoxes = [
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

        for (const testBox of testBoxes) {
            expect(isWithinTopFrustumOf(originBox)(testBox)).toBe(false)
        }
    })
})
