import { WeatherController, WeatherStatusController } from "./controller";
import type { ModuleType } from "@/modules/module";
import type { Application } from "@/infrastructure/application";

export const ROUTES: Array<ModuleType> = [
	{
		url: "/weather",
		controller: (app: Application) => new WeatherController(app),
	},
	{
		url: "/status",
		controller: (app: Application) => new WeatherStatusController(app),
	},
	{
		url: "/weather/message",
		controller: (app: Application) => new WeatherController(app),
	},
	{
		url: "/weather/city",
		controller: (app: Application) => new WeatherController(app),
	},
];
