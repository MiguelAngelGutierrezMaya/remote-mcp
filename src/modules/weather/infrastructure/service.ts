import { AgentService } from "@/modules/service";
import { WeatherAgentMCP } from "./WeatherAgent";
import type { McpAgent } from "agents/mcp";
import { HTTP_STATUS_CODES } from "@/infrastructure/utils/constants";
import { WeatherCache } from "./WeatherCache";
import type { MCPEnv } from "@/infrastructure/durableObjects/types";

export class WeatherService extends AgentService {
	/**
	 * Execute the weather service
	 * @returns {Promise<Response>} The response from the weather agent
	 */
	async execute(): Promise<Response> {
		return WeatherAgentMCP.serve(this.application.pathname).fetch(
			this.application.event,
			this.application.env as Record<string, DurableObjectNamespace<McpAgent>>,
			this.application.context,
		);
	}
}

export class WeatherStatusService extends AgentService {
	/**
	 * Execute the weather status service
	 * @returns {Promise<Response>} The response from the weather agent
	 */
	async execute(): Promise<Response> {
		// Check if KV namespace is available
		if (!this.application.env.WEATHER_CACHE_KV) {
			return new Response(
				JSON.stringify({
					error: true,
					reason: "Weather cache KV namespace not configured in worker",
				}),
				{
					status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		const weatherCache = new WeatherCache(this.application.env as MCPEnv);

		return await weatherCache.status();
	}
}

export class WeatherCityService extends AgentService {
	/**
	 * Execute the weather city service
	 * @returns {Promise<Response>} The response from the weather agent
	 */
	async execute(): Promise<Response> {
		// Route for getting weather data for a specific city

		// Check if WEATHER_CACHE binding is available
		if (!this.application.env.WEATHER_CACHE_KV) {
			return new Response(
				JSON.stringify({
					error: true,
					reason: "Weather cache or KV namespace not configured in worker",
				}),
				{
					status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		// Get the city from the URL
		const url = new URL(this.application.event.url);
		const city: string | null = url.searchParams.get("city");

		if (!city) {
			return new Response(
				JSON.stringify({
					error: true,
					reason: "City parameter is required",
				}),
				{
					status: HTTP_STATUS_CODES.BAD_REQUEST,
					headers: { "Content-Type": "application/json" },
				},
			);
		}

		return WeatherAgentMCP.serve(this.application.pathname).fetch(
			this.application.event,
			this.application.env as Record<string, DurableObjectNamespace<McpAgent>>,
			this.application.context,
		);
	}
}
