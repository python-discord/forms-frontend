module.exports = {
    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest'],
    },
    moduleNameMapper: {
        '\\.svg$': '<rootDir>/src/tests/__mocks__/svg.ts',
        "^react-markdown$": "<rootDir>/src/__mocks__/react-markdown.tsx",
    },
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!**/node_modules/**",
    ],
    collectCoverage: true,
    coverageProvider: "v8",
    setupFilesAfterEnv: ["./src/setupTests.ts"],
    testEnvironment: "jest-environment-jsdom"
}
