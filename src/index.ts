import { HTTP_STATUS_CODES } from "@/infrastructure/utils/constants";
import type { MCPEnv } from "@/infrastructure/durableObjects/types";
import { Application } from "./infrastructure/application";
import { Router } from "./infrastructure/router";
import { MethodNotImplementedError } from "./infrastructure/utils/errors/methods";
import { ModuleError } from "./infrastructure/utils/errors/modules";
import { ServiceNotImplementedError } from "./infrastructure/utils/errors/services";
import { getLogger } from "@/infrastructure/utils/logger";

// Agents
import { WeatherAgentMCP as WeatherAgentMCPClass } from "@/modules/weather/infrastructure/WeatherAgent";
import { WeatherCache as WeatherCacheClass } from "@/modules/weather/infrastructure/WeatherCache";

// Export with specific names for Cloudflare
export const WeatherAgentMCP = WeatherAgentMCPClass;
export const WeatherCache = WeatherCacheClass;

const logger = getLogger("EntryPoint");

function handleError(error: unknown): Response {
	logger.error("Handling error", {
		error: error instanceof Error ? error.message : String(error),
	});
	if (error instanceof MethodNotImplementedError) {
		return new Response(error.getMessage(), { status: error.getCode() });
	}

	if (error instanceof ModuleError) {
		return new Response(error.getMessage(), { status: error.getCode() });
	}

	if (error instanceof ServiceNotImplementedError) {
		return new Response(error.getMessage(), { status: error.getCode() });
	}

	if (error instanceof Error) {
		return new Response(error.message, { status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR });
	}

	return new Response("Internal server error", {
		status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
	});
}

/**
 * Main handler for the Worker
 *
 * Handles routing for weather data requests and status endpoint
 */
export default {
	/**
	 * Process incoming requests
	 *
	 * @param {Request} request - The incoming HTTP request
	 * @param {MCPEnv} env - Environment bindings including Durable Objects
	 * @param {ExecutionContext} ctx - Execution context for the Worker
	 * @returns {Promise<Response>} HTTP response
	 */
	async fetch(request: Request, env: MCPEnv, ctx: ExecutionContext): Promise<Response> {
		logger.info("Received request", { url: request.url, method: request.method });
		try {
			const app = new Application(request, ctx, env);
			const router = Router.instantiate(app);
			const response = await router.dispatch();
			logger.info("Request handled successfully", {
				url: request.url,
				status: response.status,
			});
			return response;
		} catch (error: unknown) {
			logger.error("Error handling request", {
				error: error instanceof Error ? error.message : String(error),
			});
			return handleError(error);
		}
	},
};
