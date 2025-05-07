import { ModuleError } from "./modules";

/**
 * Error class for handling agent response errors.
 * Extends ModuleError with a specific message and code.
 */
export class AgentResponseError extends ModuleError {
	/**
	 * Constructor for AgentResponseError.
	 * @param {string} trace - The trace message for the error
	 * @param {number} status - The HTTP status code
	 */
	constructor(trace: string, status: number) {
		super(
			{ message: `${trace} Obtained an invalid response from the agent status: ${status}` },
			status,
		);
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
