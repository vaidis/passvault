import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  maxWorkers: 1, // Run tests sequentially
  verbose: true,
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};

export default config;
