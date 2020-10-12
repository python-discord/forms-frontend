module.exports = {
    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest'],
        '^.+\\.svg$': ['jest-svg-transformer']
    },
}
