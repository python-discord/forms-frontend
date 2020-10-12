module.exports = {
    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest'],
        '^.+\\.svg$': ['jest-svg-transformer']
    },
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!**/node_modules/**",
    ],
    collectCoverage: true,
    coverageProvider: "v8",
    setupFilesAfterEnv: ["./src/setupTests.ts"]
}
