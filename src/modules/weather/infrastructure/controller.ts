import type { Application } from "@/infrastructure/application";
import { Controller } from "@/modules/controller";
import { WeatherCityService, WeatherService, WeatherStatusService } from "./service";

export class WeatherController extends Controller {
	/**
	 * Constructor for the WeatherController
	 * @param {Application} app - The application instance
	 */
	constructor(public readonly app: Application) {
		const service = new WeatherService(app);
		super(app, service);
	}

	/**
	 * GET method for the WeatherController
	 * @returns {Promise<Response>} The response from the weather service
	 */
	async GET(): Promise<Response> {
		return await this.service.execute();
	}

	/**
	 * POST method for the WeatherController
	 * @returns {Promise<Response>} The response from the weather service
	 */
	async POST(): Promise<Response> {
		return await this.service.execute();
	}
}

export class WeatherStatusController extends Controller {
	/**
	 * Constructor for the WeatherStatusController
	 * @param {Application} app - The application instance
	 */
	constructor(public readonly app: Application) {
		const service = new WeatherStatusService(app);
		super(app, service);
	}

	/**
	 * GET method for the WeatherStatusController
	 * @returns {Promise<Response>} The response from the weather service
	 */
	async GET(): Promise<Response> {
		return await this.service.execute();
	}

	/**
	 * POST method for the WeatherStatusController
	 * @returns {Promise<Response>} The response from the weather service
	 */
	async POST(): Promise<Response> {
		return await this.service.execute();
	}
}

export class WeatherCityController extends Controller {
	/**
	 * Constructor for the WeatherCityController
	 * @param {Application} app - The application instance
	 */
	constructor(public readonly app: Application) {
		const service = new WeatherCityService(app);
		super(app, service);
	}

	/**
	 * GET method for the WeatherCityController
	 * @returns {Promise<Response>} The response from the weather service
	 */
	async GET(): Promise<Response> {
		return await this.service.execute();
	}

	/**
	 * POST method for the WeatherCityController
	 * @returns {Promise<Response>} The response from the weather service
	 */
	async POST(): Promise<Response> {
		return await this.service.execute();
	}
}
