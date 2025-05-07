import type { Application } from "@/infrastructure/application";
import { ServiceNotImplementedError } from "@/infrastructure/utils/errors/services";

/**
 * Base service class for agents, providing a default execute method.
 * Should be extended to implement specific agent logic.
 */
class AgentBaseService {
	constructor(public readonly application: Application) {}

	async execute(): Promise<Response> {
		throw new ServiceNotImplementedError();
	}
}

/**
 * Wrapper mixin that overrides the execute method to provide a default response.
 * Used to extend AgentBaseService with a not implemented response.
 */
const ExecuteWrapper = (superclass: typeof AgentBaseService) =>
	class extends superclass {
		async execute(): Promise<Response> {
			return new Response("Not implemented");
		}
	};

/**
 * Main agent service class, extending AgentBaseService with ExecuteWrapper.
 * Used as the default service for agent modules.
 */
export class AgentService extends ExecuteWrapper(AgentBaseService) {}
