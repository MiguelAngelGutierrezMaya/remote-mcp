/**
 * Represents a namespace for interacting with Durable Objects, allowing creation and retrieval of object IDs and stubs.
 */
export interface DurableObjectNamespace {
	idFromName(name: string): DurableObjectId;
	idFromString(id: string): DurableObjectId;
	get(id: DurableObjectId): DurableObjectStub;
}

/**
 * Represents a unique identifier for a Durable Object instance.
 */
export interface DurableObjectId {
	toString(): string;
	equals(other: DurableObjectId): boolean;
}

/**
 * Represents a stub for interacting with a Durable Object instance, allowing fetch operations.
 */
export interface DurableObjectStub {
	fetch(url: string | URL | Request, init?: RequestInit): Promise<Response>;
}

/**
 * Environment interface for MCP, including bindings for weather cache and other variables.
 */
export interface MCPEnv {
	WEATHER_CACHE_KV: KVNamespace;
	[key: string]: unknown;
}
