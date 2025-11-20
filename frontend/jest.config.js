import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    ...tsJestTransformCfg,
  },
  setupFilesAfterEnv: ["<rootDir>/tests/setupTests.ts"],
  moduleNameMapper: {
    "^.+\\.(css|scss)$": "identity-obj-proxy", // Mock CSS imports
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
