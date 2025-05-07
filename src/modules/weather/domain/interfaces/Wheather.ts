/**
 * Interface definitions for weather data models
 */

/**
 * Weather data structure returned from the weather API
 * @interface WeatherData
 */
export interface WeatherData {
	latitude: number;
	longitude: number;
	timezone: string;
	current: {
		temperature_2m: number;
		precipitation: number;
		is_day: number;
		rain: number;
	};
}

/**
 * Geocoding result structure returned from the geocoding API
 * @interface GeocodingResult
 */
export interface GeocodingResult {
	results?: Array<{
		latitude: number;
		longitude: number;
		name: string;
	}>;
}
