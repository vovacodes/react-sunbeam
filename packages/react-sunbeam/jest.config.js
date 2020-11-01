module.exports = {
    preset: "ts-jest",
    testMatch: ["<rootDir>/src/**/*.spec.ts", "<rootDir>/src/**/*.spec.tsx"],
    resolver: "<rootDir>/jest/js-extension-resolver",
}
