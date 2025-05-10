# Weather MCP Server on Cloudflare Workers

A robust, extensible Model Context Protocol (MCP) server for weather data, built on Cloudflare Workers with Durable Objects for caching and state. Features strong backend logging, modular architecture, and easy integration with Cloudflare AI Playground and Claude Desktop.

---

## 🚀 Quick Start

### Deploy to Cloudflare Workers

[![Deploy to Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/ai/tree/main/demos/remote-mcp-authless)

Or clone and deploy manually:

```bash
git clone <your-repo-url>
cd <your-repo>
pnpm install # or npm install
npx wrangler dev
```

---

## 🗂️ Project Structure

```
src/
  index.ts                        # Cloudflare Worker entry point
  infrastructure/
    application.ts                # Application context and bootstrapping
    router.ts                     # Main backend router
    utils/
      logger.ts                   # Logger utility (contextual, leveled)
      constants.ts                # Shared constants
      errors/                     # Custom error classes
    durableObjects/               # Durable Object types and interfaces
  modules/
    controller.ts                 # Base controller logic
    service.ts                    # Base service logic
    module.ts                     # Module registration
    weather/
      infrastructure/
        WeatherAgent.ts           # MCP agent for weather data
        WeatherCache.ts           # Durable Object-backed weather cache
        service.ts                # Weather service logic
        controller.ts             # Weather controller
        router.ts                 # Weather-specific router
        constants.ts, DTO.ts      # Weather module constants and DTOs
      domain/
        interfaces/
          Wheather.ts             # Weather data and geocoding interfaces
```

---

## 🧩 Features

- **MCP Agent**: Exposes weather data as an MCP tool.
- **Durable Object Caching**: Efficient, rate-limited weather/geocoding API calls.
- **Backend Logging**: Contextual, leveled logs for all backend modules (see `src/infrastructure/utils/logger.ts`).
- **Modular Design**: Easily extend with new agents, services, or tools.

---

## 🧪 Testing & Development

### Local Development

Start the worker locally:

```bash
npx wrangler dev
```

### Test Endpoints

- **Weather Data**:  
  `GET http://localhost:8787/weather?city=London`
- **Weather Status**:  
  `GET http://localhost:8787/weather/status`

You can use `curl`, Postman, or your browser.

### View Logs

Logs are output to the console with context and level.  
Example:
```
[2024-05-01T12:00:00.000Z] [INFO] [WeatherCache] Fetching weather data | {"city":"London"}
```

### Integration with Cloudflare AI Playground

1. Deploy your worker.
2. Go to https://playground.ai.cloudflare.com/
3. Enter your MCP server URL (e.g., `https://your-worker.workers.dev/sse`).

### Integration with Claude Desktop

Follow [Anthropic's Quickstart](https://modelcontextprotocol.io/quickstart/user) and use the [mcp-remote proxy](https://www.npmjs.com/package/mcp-remote).

---

## 🛠️ Customization

- Add new tools/agents in `src/modules/`.
- Extend logging or error handling as needed.
- See `src/infrastructure/utils/logger.ts` for logging best practices.

---

## 📝 Contributing

PRs and issues welcome! Please ensure code is formatted with [Biome](https://biomejs.dev/) and includes JSDoc comments for all new classes and interfaces.

---

## 📖 DeepWiki
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/MiguelAngelGutierrezMaya/remote-mcp)

## 📄 License

MIT
