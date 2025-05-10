/// <reference types="jest" />

declare module '@jest/globals' {
	import type { jest as JestNamespace } from '@jest/types';
	
	export const jest: typeof JestNamespace;
	export const describe: (name: string, fn: () => void) => void;
	export const test: (name: string, fn: () => void) => void;
	export const it: (name: string, fn: () => void) => void;
	export const expect: <T = any>(actual: T) => jest.Matchers<void>;
	export const beforeEach: (fn: () => void) => void;
	export const afterEach: (fn: () => void) => void;
	export const beforeAll: (fn: () => void) => void;
	export const afterAll: (fn: () => void) => void;
}

// Augment the global environment types
declare global {
	// Don't conflict with NodeJS types
	export namespace NodeJS {
		interface Global {
			fetch: typeof fetch;
			Response: typeof Response;
		}
	}
} 