/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	preset: "ts-jest/presets/js-with-ts-esm",
	testEnvironment: "node",
	roots: ["<rootDir>/src"],
	testMatch: ["**/__tests__/**/*.test.ts"],
	transform: {
		"^.+\\.tsx?$": ["ts-jest", {
			tsconfig: "tsconfig.jest.json",
			useESM: true
		}]
	},
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1"
	},
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageReporters: ["text", "lcov"],
	extensionsToTreatAsEsm: [".ts"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	transformIgnorePatterns: [
		"node_modules/(?!(agents|@modelcontextprotocol)/)"
	],
	maxWorkers: "50%",
	verbose: true
}; 