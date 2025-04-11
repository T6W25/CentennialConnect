module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  testMatch: [
    '**/tests/**/*.test.js',
  ],
  moduleFileExtensions: ['js', 'json', 'node'],
  transformIgnorePatterns: [
    '/node_modules/(?!your-es-module-package)/',
  ],
};
