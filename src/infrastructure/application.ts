import type { MCPEnv } from "./durableObjects/types";
import type { ModuleType } from "../modules/module";

/**
 * Modules
 */

// Weather
import { ROUTES as WEATHER_ROUTES } from "@/modules/weather/infrastructure/router";

export class Application {
	public readonly event: Request;
	public readonly method: string;
	public readonly context: ExecutionContext;
	public readonly env: MCPEnv;
	public readonly modules: Array<ModuleType>;
	public readonly routes: Array<string>;
	public readonly url: URL;
	public readonly pathname: string;

	/**
	 * Constructor for the Application class.
	 * @param {Request} event - The incoming HTTP request
	 * @param {ExecutionContext} context - The execution context for the Worker
	 * @param {MCPEnv} env - The environment bindings for the Worker
	 */
	constructor(event: Request, context: ExecutionContext, env: MCPEnv) {
		this.event = event;
		this.url = new URL(event.url);
		this.method = event.method;
		this.pathname = this.url.pathname;
		this.context = context;
		this.env = env;
		this.modules = [...WEATHER_ROUTES];
		this.routes = this.modules.map((mod) => mod.url);
	}
}
