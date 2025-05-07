import { HTTP_STATUS_CODES } from "@/infrastructure/utils/constants";
import { ModuleError } from "./modules";

/**
 * Error thrown when an HTTP method is not implemented for a route.
 * Extends ModuleError with a specific message and code.
 */
export class MethodNotImplementedError extends ModuleError {
	/**
	 * Constructor for MethodNotImplementedError.
	 */
	constructor() {
		super({ message: "Method not implemented" }, HTTP_STATUS_CODES.NOT_IMPLEMENTED);
	}

	/**
	 * Get the error message.
	 * @returns {string} The error message
	 */
	getMessage(): string {
		return this.params.message as string;
	}

	/**
	 * Get the HTTP status code.
	 * @returns {number} The HTTP status code
	 */
	getCode(): number {
		return this.code;
	}
}

/**
 * Error thrown when a requested route cannot be found.
 * Extends ModuleError with a specific message and code.
 */
export class RouteNotFoundError extends ModuleError {
	/**
	 * Constructor for RouteNotFoundError.
	 */
	constructor() {
		super({ message: "Route not found" }, HTTP_STATUS_CODES.NOT_FOUND);
	}

	/**
	 * Get the error message.
	 * @returns {string} The error message
	 */
	getMessage(): string {
		return this.params.message as string;
	}

	/**
	 * Get the HTTP status code.
	 * @returns {number} The HTTP status code
	 */
	getCode(): number {
		return this.code;
	}
}
