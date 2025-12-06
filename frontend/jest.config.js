export default {
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",

  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],

  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.jest.json",
      },
    ],
  },

  moduleNameMapper: {
    "^.+\\.(css|scss)$": "identity-obj-proxy",
  },

  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
