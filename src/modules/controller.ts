import { MethodNotImplementedError } from "@/infrastructure/utils/errors/methods";
import type { Application } from "../infrastructure/application";
import type { AgentService } from "./service";

/**
 * Base controller class providing default HTTP method handlers for agents.
 * Should be extended or wrapped to implement specific logic for each method.
 */
class BaseController {
	constructor(
		public readonly app: Application,
		public readonly service: AgentService,
	) {}

	async GET(): Promise<Response> {
		throw new MethodNotImplementedError();
	}

	async POST(): Promise<Response> {
		throw new MethodNotImplementedError();
	}

	async PUT(): Promise<Response> {
		throw new MethodNotImplementedError();
	}

	async DELETE(): Promise<Response> {
		throw new MethodNotImplementedError();
	}
}

const GetWrapper = (superclass: typeof BaseController) =>
	class extends superclass {
		async GET(): Promise<Response> {
			return await this.service.execute();
		}
	};

const PostWrapper = (superclass: typeof BaseController) =>
	class extends superclass {
		async POST(): Promise<Response> {
			return await this.service.execute();
		}
	};

/**
 * Main controller class that supports GET and POST methods by delegating to the agent service.
 * Extends BaseController with wrappers for GET and POST.
 */
export class Controller extends GetWrapper(PostWrapper(BaseController)) {}
