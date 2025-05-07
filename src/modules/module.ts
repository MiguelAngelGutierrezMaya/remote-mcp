import type { Controller } from "@/modules/controller";
import type { Application } from "@/infrastructure/application";

/**
 * Represents a module in the application, including its URL and controller factory.
 */
export interface ModuleType {
	url: string;
	controller: (app: Application) => Controller;
}
