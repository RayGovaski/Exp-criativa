module.exports = {
  testEnvironment: 'jsdom', 
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], 
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy', 
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testMatch: [
    '<rootDir>/src/**/*.{spec,test}.{js,jsx}',
  ]
};