const {defaults} = require('jest-config');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'test.ts', 'test.tsx'],
  collectCoverageFrom: [
    "src/*.{ts,tsx,js,jsx}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ]
};