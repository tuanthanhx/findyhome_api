/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/modules/**/*.test.ts'],
  clearMocks: true,
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './test/result',
        filename: 'report.html',
        expand: true,
      },
    ],
  ],
};
