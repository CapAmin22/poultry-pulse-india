
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  // Ignore node_modules by default
  transformIgnorePatterns: ['/node_modules/'],
  // Setup files to run before tests
  setupFiles: ['./tests/setup.js'],
};
