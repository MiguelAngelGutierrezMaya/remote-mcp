import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import type { WeatherData } from "../../domain/interfaces/Wheather";
import { AgentResponseError } from "@/infrastructure/utils/errors/agents";
import { WeatherCache } from "../WeatherCache";
import type { MCPEnv } from "@/infrastructure/durableObjects/types";

type MockResponse = {
	json: () => Promise<any>;
	ok: boolean;
};

// Mock the Response constructor
globalThis.Response = jest.fn().mockImplementation((body: string) => ({
	json: () => Promise.resolve(JSON.parse(body)),
	ok: true,
})) as unknown as typeof Response;

// Mock Modules
jest.mock("@/infrastructure/utils/logger", () => ({
	getLogger: jest.fn().mockReturnValue({
		debug: jest.fn(),
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
	}),
}));

const mockWeatherData: WeatherData = {
	latitude: 40.4168,
	longitude: -3.7038,
	timezone: "Europe/Madrid",
	current: {
		temperature_2m: 20,
		precipitation: 0,
		is_day: 1,
		rain: 0,
	},
};

describe("WeatherCache", () => {
	let mockWeatherCache: WeatherCache;

	beforeEach(() => {
		// Create mock environment with KV namespace
		const mockEnv = {
			WEATHER_CACHE_KV: {
				get: jest.fn().mockImplementation(() => {
					// This simulates the DO stub
					return {
						fetch: jest.fn().mockResolvedValue({
							json: () => Promise.resolve(mockWeatherData),
							ok: true,
						} as MockResponse),
					};
				}),
				put: jest.fn(),
				list: jest.fn(),
				getWithMetadata: jest.fn(),
			},
		};

		// Create instance with mock env
		mockWeatherCache = new WeatherCache(mockEnv as MCPEnv);
	});

	it("should return error if city is not provided", async () => {
		try {
			await mockWeatherCache.fetch("");
		} catch (error) {
			expect(error).toBeInstanceOf(AgentResponseError);
		}
	});

	it("should successfully fetch weather data", async () => {
		// Arrange - Mock internal method
		const spyGetWeatherData = jest
			.spyOn(mockWeatherCache as any, "getWeatherData")
			.mockResolvedValue(mockWeatherData);

		// Act
		const result = await mockWeatherCache.fetch("Madrid");

		// Assert
		expect(result).toEqual(mockWeatherData);
		expect(spyGetWeatherData).toHaveBeenCalled();
	});
});
