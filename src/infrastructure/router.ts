import type { Application } from "./application";
import type { Controller } from "../modules/controller";
import type { ModuleType } from "../modules/module";
import { MethodNotImplementedError, RouteNotFoundError } from "./utils/errors/methods";
import { ModuleNotFoundError } from "./utils/errors/modules";
import { getLogger } from "./utils/logger";

export class Router {
	private readonly logger = getLogger('Router');
	/**
	 * The application instance
	 */
	private readonly app: Application;

	/**
	 * The controller instance
	 */
	private readonly controller: Controller;

	/**
	 * The constructor for the Router
	 * @param {Application} app - The application instance
	 * @param {Controller} controller - The controller instance
	 */
	constructor(app: Application, controller: Controller) {
		this.app = app;

		this.controller = controller;
	}

	/**
	 * Instantiates a new Router
	 * @param {Application} app - The application instance
	 * @returns {Router} The router instance
	 */
	static instantiate(app: Application): Router {
		const logger = getLogger('Router');
		logger.info('Instantiating router', { pathname: app.pathname });
		const route: string | undefined = app.routes.find((route) => route === app.pathname);

		if (!route) {
			logger.warn('Route not found', { pathname: app.pathname });
			throw new RouteNotFoundError();
		}

		const mod: ModuleType | undefined = app.modules.find((mod) => mod.url === route);

		if (!mod) {
			logger.warn('Module not found for route', { route });
			throw new ModuleNotFoundError();
		}

		const controller = mod.controller(app);
		logger.info('Controller resolved', { controller: controller.constructor.name });

		const router = new Router(app, controller);
		return router;
	}

	/**
	 * Dispatches the request to the controller
	 * @returns {Promise<Response>} The response from the controller
	 */
	async dispatch(): Promise<Response> {
		this.logger.info('Dispatching request', { method: this.app.method, pathname: this.app.pathname });
		const func = this.controller[
			this.app.method as keyof Controller
		] as () => Promise<Response>;

		if (!func) {
			this.logger.error('Method not implemented', { method: this.app.method });
			throw new MethodNotImplementedError();
		}

		try {
			const response = await func.bind(this.controller)();
			this.logger.info('Request dispatched successfully');
			return response;
		} catch (error) {
			this.logger.error('Error dispatching request', { error: error instanceof Error ? error.message : String(error) });
			throw error;
		}
	}
}
