import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DataDTO } from "@/modules/weather/infrastructure/DTO";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { McpAgent } from "agents/mcp";
import type { MCPEnv } from "@/infrastructure/durableObjects/types";
import { AGENT_CAPABILITIES } from "./constants";
import { AgentResponseError } from "@/infrastructure/utils/errors/agents";
import { HTTP_STATUS_CODES } from "@/infrastructure/utils/constants";
import { WeatherCache } from "./WeatherCache";
import { getLogger } from "@/infrastructure/utils/logger";

/**
 * MCP agent class for weather data
 */
export class WeatherAgentMCP extends McpAgent {
	private logger = getLogger('WeatherAgentMCP');
	server = new McpServer({
		name: "Weather Agent",
		version: "1.0.0",
	});

	/**
	 * Handle an error
	 * @param error - The error to handle
	 * @returns The error response
	 */
	private handleError(error: unknown): CallToolResult {
		this.logger.error('Handling error in WeatherAgentMCP', { error: error instanceof Error ? error.message : String(error) });
		const response: CallToolResult = {
			content: [],
		};

		if (error instanceof AgentResponseError) {
			response.content.push({
				type: "text",
				text: JSON.stringify(error.getMessage()),
			});
		}

		if (error instanceof Error) {
			response.content.push({
				type: "text",
				text: JSON.stringify({
					error: true,
					reason: error.message,
				}),
			});
		}

		return response;
	}

	/**
	 * Initialize the MCP agent with tools
	 * @returns {Promise<void>}
	 */
	async init(): Promise<void> {
		this.logger.info('Initializing WeatherAgentMCP');
		// Weather fetch tool
		this.server.tool(
			AGENT_CAPABILITIES.fetchWeather,
			DataDTO.shape,
			/**
			 * Fetch weather data for a specified city
			 * @param {Object} args - Tool arguments
			 * @param {string} args.city - City name to fetch weather for
			 * @returns {Promise<CallToolResult>} Tool result containing weather data
			 */
			async (args: { city: string }): Promise<CallToolResult> => {
				this.logger.info('fetchWeather tool called', { city: args.city });
				try {
					const env: MCPEnv = this.env as MCPEnv;

					if (!env) {
						this.logger.warn('Weather cache binding not configured');
						throw new AgentResponseError(
							"[fetchWeather -> Weather cache binding not configured]",
							HTTP_STATUS_CODES.BAD_REQUEST,
						);
					}

					const weatherCache = new WeatherCache(env);

					// Send the request to the Durable Object
					const data = await weatherCache.fetch(args.city);

					if (data instanceof AgentResponseError) {
						this.logger.warn('AgentResponseError from WeatherCache', { message: data.getMessage() });
						throw data;
					}

					this.logger.info('Weather data fetched successfully', { city: args.city });
					return {
						content: [
							{
								type: "text",
								text: JSON.stringify(data, null, 2),
							},
						],
					};
				} catch (error) {
					this.logger.error('Error in fetchWeather tool', { error: error instanceof Error ? error.message : String(error) });
					return this.handleError(error);
				}
			},
		);
	}
}
