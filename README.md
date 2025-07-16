# MCP TypeScript Boilerplate

A complete boilerplate for creating Model Context Protocol (MCP) servers and clients in TypeScript.

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm or yarn package manager

## Quick Start

1. **Clone or download this boilerplate**
   ```bash
   git clone https://github.com/RishabhKodes/tsMCP.git
   cd tsMCP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run the server**
   ```bash
   npm run start:server
   ```

5. **Test with the client** (in a new terminal)
   ```bash
   npm run start:client
   ```

## Project Structure

```
src/
├── server.ts          # MCP server implementation
├── client.ts          # Example MCP client
└── types/             # Custom type definitions (if needed)

build/                 # Compiled JavaScript output
package.json          # Dependencies and scripts
tsconfig.json         # TypeScript configuration
README.md            # This file
```

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run start:server` - Start the MCP server
- `npm run start:client` - Run the example client
- `npm run dev:server` - Build and run server in one command
- `npm run dev:client` - Build and run client in one command
- `npm run clean` - Remove build directory

## Server Features

The example server includes:

### Tools
- **calculate** - Perform basic arithmetic operations (add, subtract, multiply, divide)
- **echo** - Echo back the provided text
- **get_memory** - Retrieve values from the in-memory store
- **set_memory** - Store values in the in-memory store

### Resources
- **memory://config** - Configuration settings
- **memory://data** - Sample application data

## Server Implementation

The server is built using the official MCP SDK and includes:

```typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'tsMCP',
  version: '1.0.0',
}, {
  capabilities: {
    resources: {},
    tools: {},
  },
});
```

### Adding New Tools

To add a new tool, implement these handler functions:

1. **List the tool** in `ListToolsRequestSchema` handler:
```typescript
{
  name: 'my_new_tool',
  description: 'Description of what the tool does',
  inputSchema: {
    type: 'object',
    properties: {
      input: { type: 'string', description: 'Input parameter' }
    },
    required: ['input']
  }
}
```

2. **Handle tool execution** in `CallToolRequestSchema` handler:
```typescript
case 'my_new_tool': {
  const input = args?.input;
  // Your tool logic here
  return {
    content: [{
      type: 'text',
      text: `Result: ${result}`
    }]
  };
}
```

### Adding New Resources

1. **List the resource** in `ListResourcesRequestSchema` handler:
```typescript
{
  uri: 'custom://my-resource',
  mimeType: 'application/json',
  name: 'My Resource',
  description: 'Description of the resource'
}
```

2. **Handle resource reading** in `ReadResourceRequestSchema` handler:
```typescript
if (uri === 'custom://my-resource') {
  return {
    contents: [{
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(myData, null, 2)
    }]
  };
}
```

## Client Implementation

The example client demonstrates how to:

- Connect to an MCP server
- List available tools and resources
- Call tools with parameters
- Read resources
- Handle errors and cleanup

## Integration with AI Applications

### Claude Desktop

To integrate your MCP server with Claude Desktop, add this configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tsMCP": {
      "command": "node",
      "args": ["/path/to/your/project/build/server.js"]
    }
  }
}
```

### Cursor

To integrate your MCP server with Cursor, add this configuration to your MCP settings:

```json
{
  "mcpServers": {
    "tsMCP": {
      "command": "node",
      "args": ["/path/to/your/project/build/server.js"]
    }
  }
}
```

### Other Applications

The server communicates over stdio, making it compatible with any MCP client that supports the stdio transport.

## Error Handling

The boilerplate includes comprehensive error handling:

- Input validation using Zod schemas
- Proper MCP error codes and messages
- Graceful cleanup on shutdown
- Type-safe parameter handling

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
# Server configuration
MCP_SERVER_NAME=my-custom-server
MCP_SERVER_VERSION=1.0.0

# Application-specific settings
LOG_LEVEL=info
```

## Advanced Usage

### Custom Transports

You can implement custom transports beyond stdio:

```typescript
import { WebSocketServerTransport } from '@modelcontextprotocol/sdk/server/websocket.js';

const transport = new WebSocketServerTransport({
  port: 8080
});
```

### Middleware and Plugins

Extend the server with custom middleware:

```typescript
server.setRequestHandler(MyCustomRequestSchema, async (request) => {
  // Custom handling logic
});
```

## Resources

- [MCP Official Documentation](https://github.com/modelcontextprotocol)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [MCP SDK Reference](https://github.com/modelcontextprotocol/typescript-sdk)
