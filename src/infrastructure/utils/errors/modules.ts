import { HTTP_STATUS_CODES } from "@/infrastructure/utils/constants";

/**
 * Abstract base class for module-related errors, extending the standard Error class.
 * Provides a structure for custom error messages and codes.
 */
export abstract class ModuleError extends Error {
	/**
	 * Constructor for ModuleError.
	 * @param {Record<string, unknown>} params - The parameters for the error
	 * @param {number} code - The HTTP status code
	 */
	constructor(
		public readonly params: Record<string, unknown> = {},
		public readonly code: number = HTTP_STATUS_CODES.NOT_IMPLEMENTED,
	) {
		super();
	}

	abstract getMessage(): string;
	abstract getCode(): number;
}

/**
 * Error thrown when a requested module cannot be found.
 * Extends ModuleError with a specific message and code.
 */
export class ModuleNotFoundError extends ModuleError {
	/**
	 * Constructor for ModuleNotFoundError.
	 */
	constructor() {
		super({ message: "Module not found" }, HTTP_STATUS_CODES.NOT_FOUND);
	}

	getMessage(): string {
		return this.params.message as string;
	}

	getCode(): number {
		return this.code;
	}
}
