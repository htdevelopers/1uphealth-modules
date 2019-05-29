const {defaults} = require('jest-config');

module.exports = {
  roots: [ '<rootDir>/tests' ],
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
};