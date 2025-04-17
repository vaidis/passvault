import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  //maxWorkers: 1,
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
  testEnvironment: "node",
  silent: false,
  verbose: true,
};

export default config;
