import type { MCPEnv } from "@/infrastructure/durableObjects/types";
import { HTTP_STATUS_CODES } from "@/infrastructure/utils/constants";
import { AgentResponseError } from "@/infrastructure/utils/errors/agents";
import type { GeocodingResult, WeatherData } from "@/modules/weather/domain/interfaces/Wheather";
import { getLogger } from "@/infrastructure/utils/logger";

/**
 * Interface that both KVNamespace and our fallback MemoryCache implement for cache operations.
 * Provides methods for getting, putting, and listing cached items.
 */
interface CacheStorage {
	get(key: string, options?: { type: "json" }): Promise<any>;
	put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
	getWithMetadata<T, M>(
		key: string,
		options?: { type: "json" },
	): Promise<{ value: T; metadata: M }>;
	list(options?: { prefix?: string }): Promise<{ keys: { name: string }[] }>;
}

/**
 * Extended interface for cached data with a timestamp property.
 * Used to store data along with the time it was cached.
 */
interface TimestampedData {
	data: any;
	timestamp: number;
}

// KV Metadata type
type KVMetadata = {
	expirationTtl?: number;
	[key: string]: unknown;
};

export class WeatherCache {
	private logger = getLogger('WeatherCache');

	/**
	 * Prefixes for the KV storage
	 */
	private readonly WEATHER_PREFIX: string = "weather:";
	private readonly GEOCODING_PREFIX: string = "geocoding:";

	private readonly WEATHER_URL: string = "https://api.open-meteo.com/v1/forecast";
	private readonly GEOCODING_URL: string = "https://geocoding-api.open-meteo.com/v1/search";

	// Cache duration: 5 minutes (in milliseconds)
	private readonly CACHE_TTL: number = 1 * 60 * 1000; // 1 minute in milliseconds
	private readonly CACHE_TTL_SECONDS: number = 1 * 60; // 1 minute in seconds for KV TTL

	private instanceCreatedAt = Date.now();
	private instanceId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

	/**
	 * Constructor for the WeatherCache class
	 * @param {MCPEnv} env - The environment variables
	 */
	constructor(private readonly env: MCPEnv) {}

	/**
	 * Fetches weather data for a given city
	 * @param {string} city - The name of the city to get weather data for
	 * @returns {Promise<WeatherData | AgentResponseError>} Weather data or error
	 */
	public async fetch(city: string): Promise<WeatherData | AgentResponseError> {
		this.logger.info('Fetching weather data', { city });
		if (!city) {
			this.logger.warn('City not provided');
			throw new AgentResponseError(
				"[fetch -> City not provided]",
				HTTP_STATUS_CODES.BAD_REQUEST,
			);
		}
		return await this.getWeatherData(city, this.env.WEATHER_CACHE_KV);
	}

	/**
	 * Retrieves status information about the weather cache
	 * @returns {Promise<Response>} Status response
	 */
	public async status(): Promise<Response> {
		this.logger.info('Fetching weather cache status');
		const now = Date.now();

		const kvCacheKeys = {
			weather: [] as string[],
			geocoding: [] as string[],
		};

		const kv: CacheStorage = this.env.WEATHER_CACHE_KV;

		try {
			// Get list of keys from KV
			const weatherList = await kv.list({ prefix: this.WEATHER_PREFIX });
			const geocodingList = await kv.list({ prefix: this.GEOCODING_PREFIX });
			this.logger.debug('KV keys listed', { weatherKeys: weatherList.keys.length, geocodingKeys: geocodingList.keys.length });

			kvCacheKeys.weather = weatherList.keys.map((k: { name: string }) =>
				k.name.replace(this.WEATHER_PREFIX, ""),
			);
			kvCacheKeys.geocoding = geocodingList.keys.map((k: { name: string }) =>
				k.name.replace(this.GEOCODING_PREFIX, ""),
			);

			// Get a sample of cache data if available
			const cacheDetailsSample = [];

			if (weatherList.keys.length > 0) {
				const sampleKey = weatherList.keys[0].name;
				const sampleData = await kv.get(sampleKey, { type: "json" });
				this.logger.debug('Sample cache data fetched', { sampleKey });
				const metadata = await kv.getWithMetadata<any, KVMetadata>(sampleKey, {
					type: "json",
				});

				cacheDetailsSample.push({
					key: sampleKey,
					value: sampleData,
					metadata: metadata.metadata,
					expirationTtl: metadata.metadata?.expirationTtl,
				});
			}

			// Test KV storage with simple write and read
			const testKey = `test-kv-${Date.now()}`;
			const testValue = `test-value-${Date.now()}`;

			const storageTestResult = {
				success: false,
				writeTime: 0,
				readTime: 0,
				readValue: null as unknown,
				error: "",
			};

			try {
				// Test write
				const writeStart = Date.now();
				await kv.put(testKey, testValue, {
					expirationTtl: 60, // 1 minute test expiration
				});
				this.logger.debug('Test key written to KV', { testKey });
				storageTestResult.writeTime = Date.now() - writeStart;

				// Test read
				const readStart = Date.now();
				storageTestResult.readValue = await kv.get(testKey);
				this.logger.debug('Test key read from KV', { testKey });
				storageTestResult.readTime = Date.now() - readStart;

				storageTestResult.success = storageTestResult.readValue === testValue;
			} catch (error) {
				storageTestResult.error = error instanceof Error ? error.message : String(error);
			}

			return new Response(
				JSON.stringify({
					instanceInfo: {
						id: this.instanceId,
						createdAt: this.instanceCreatedAt,
						createdAtISO: new Date(this.instanceCreatedAt).toISOString(),
						uptime: (now - this.instanceCreatedAt) / 1000, // in seconds
					},
					cacheInfo: {
						ttlMs: this.CACHE_TTL,
						ttlMinutes: this.CACHE_TTL / 60000,
						ttlSeconds: this.CACHE_TTL_SECONDS,
						cachedCitiesCount: kvCacheKeys.weather.length,
						cachedGeocodingsCount: kvCacheKeys.geocoding.length,
					},
					cacheKeys: kvCacheKeys,
					cacheDetailsSample,
					storageTest: storageTestResult,
					kvAvailable: !!this.env.WEATHER_CACHE_KV,
					currentTime: now,
					currentTimeISO: new Date(now).toISOString(),
				}),
				{
					headers: { "Content-Type": "application/json" },
				},
			);
		} catch (error) {
			this.logger.error('Error fetching KV data', { error: error instanceof Error ? error.message : String(error) });
			return new Response(
				JSON.stringify({
					error: true,
					reason: "Error fetching KV data",
					details: error instanceof Error ? error.message : String(error),
					instanceInfo: {
						id: this.instanceId,
						createdAt: this.instanceCreatedAt,
						createdAtISO: new Date(this.instanceCreatedAt).toISOString(),
						uptime: (now - this.instanceCreatedAt) / 1000,
					},
					cacheConfig: {
						ttlMs: this.CACHE_TTL,
						ttlMinutes: this.CACHE_TTL / 60000,
					},
					kvAvailable: !!this.env.WEATHER_CACHE_KV,
				}),
				{
					status: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
					headers: { "Content-Type": "application/json" },
				},
			);
		}
	}

	/**
	 * Retrieves weather data for a given city (with caching)
	 * @param {string} city - The name of the city to get weather data for
	 * @param {CacheStorage} kv - KV namespace or memory cache for caching
	 * @returns {Promise<WeatherData | ErrorResponse>} Weather data or error
	 */
	private async getWeatherData(
		city: string,
		kv: CacheStorage,
	): Promise<WeatherData | AgentResponseError> {
		const key = `${this.WEATHER_PREFIX}${city}`;
		const now = Date.now();
		this.logger.debug('Getting weather data', { city, key });
		const cachedData = (await kv.get(key, { type: "json" })) as TimestampedData | null;
		if (cachedData?.data && cachedData?.timestamp) {
			const isExpired = now - cachedData.timestamp > this.CACHE_TTL;
			if (!isExpired) {
				this.logger.info('Cache hit for weather data', { city });
				return cachedData.data as WeatherData;
			}
			this.logger.info('Cache expired for weather data', { city });
		} else {
			this.logger.info('Cache miss for weather data', { city });
		}
		const coordinates = await this.getGeocodingData(city, kv);
		if (coordinates instanceof AgentResponseError) {
			this.logger.warn('Geocoding error', { city, message: coordinates.getMessage() });
			throw coordinates;
		}
		if (!coordinates.results || coordinates.results.length === 0) {
			this.logger.warn('No geocoding results', { city });
			throw new AgentResponseError(
				"[getWeatherData -> Geocoding API]",
				HTTP_STATUS_CODES.NOT_FOUND,
			);
		}
		const { latitude, longitude } = coordinates.results[0];
		const weatherUrl = `${this.WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=temperature_2m,precipitation,is_day,rain&timezone=auto&forecast_days=1`;
		this.logger.info('Fetching weather from API', { weatherUrl });
		const weatherResponse = await fetch(weatherUrl);
		if (!weatherResponse.ok) {
			this.logger.error('Weather API error', { status: weatherResponse.status });
			throw new AgentResponseError("[getWeatherData -> Weather API]", weatherResponse.status);
		}
		const weatherData = (await weatherResponse.json()) as WeatherData;
		const timestampedData: TimestampedData = {
			data: weatherData,
			timestamp: now,
		};
		await kv.put(key, JSON.stringify(timestampedData), {
			expirationTtl: this.CACHE_TTL_SECONDS,
		});
		this.logger.info('Weather data cached', { city });
		return weatherData;
	}

	/**
	 * Retrieves geocoding data (with caching)
	 * @param {string} city - The name of the city to get coordinates for
	 * @param {CacheStorage} kv - KV namespace or memory cache for caching
	 * @returns {Promise<GeocodingResult | ErrorResponse>} Geocoding result or error
	 * @private
	 */
	private async getGeocodingData(
		city: string,
		kv: CacheStorage,
	): Promise<GeocodingResult | AgentResponseError> {
		const key = `${this.GEOCODING_PREFIX}${city}`;
		const now = Date.now();
		this.logger.debug('Getting geocoding data', { city, key });
		const cachedData = (await kv.get(key, { type: "json" })) as TimestampedData | null;
		if (cachedData?.data && cachedData?.timestamp) {
			const isExpired = now - cachedData.timestamp > this.CACHE_TTL;
			if (!isExpired) {
				this.logger.info('Cache hit for geocoding data', { city });
				return cachedData.data as GeocodingResult;
			}
			this.logger.info('Cache expired for geocoding data', { city });
		} else {
			this.logger.info('Cache miss for geocoding data', { city });
		}
		const geocodingUrl = `${this.GEOCODING_URL}?name=${encodeURIComponent(city)}&count=10&language=en&format=json`;
		this.logger.info('Fetching geocoding from API', { geocodingUrl });
		const response = await fetch(geocodingUrl);
		if (!response.ok) {
			this.logger.error('Geocoding API error', { status: response.status });
			throw new AgentResponseError("[getGeocodingData -> Geocoding API]", response.status);
		}
		const data = (await response.json()) as GeocodingResult;
		const timestampedData: TimestampedData = {
			data: data,
			timestamp: now,
		};
		await kv.put(key, JSON.stringify(timestampedData), {
			expirationTtl: this.CACHE_TTL_SECONDS,
		});
		this.logger.info('Geocoding data cached', { city });
		return data;
	}
}
