import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest", // Use ts-jest for TypeScript support
  testEnvironment: "jsdom", // Set the test environment to jsdom for React testing
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Setup file for any global configurations
  transform: {
    "^.+\\.tsx?$": "babel-jest", // Use ts-jest for TypeScript and TSX files
    "^.+\\.(js|jsx)$": "babel-jest", // Use babel-jest for JavaScript and JSX files
  },
  moduleNameMapper: {
    // Mock the next/image component
    "^next/image$": "<rootDir>/__mocks__/next/image.js",
    // Handle image imports
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
    // Handle CSS module imports
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
  // Collect coverage information
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default config;
