import { HTTP_STATUS_CODES } from "@/infrastructure/utils/constants";
import { ModuleError } from "./modules";

/**
 * Error thrown when a service is not implemented.
 * Extends ModuleError with a specific message and code.
 */
export class ServiceNotImplementedError extends ModuleError {
	constructor() {
		super({ message: "Service not implemented" }, HTTP_STATUS_CODES.NOT_IMPLEMENTED);
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
