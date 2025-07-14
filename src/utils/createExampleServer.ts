import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
  type CallToolRequest,
  type ReadResourceRequest,
} from '@modelcontextprotocol/sdk/types.js';

/**
 * Creates a pre-configured MCP server with example tools and resources
 */
export function createExampleServer(name: string = 'example-server', version: string = '1.0.0') {
  const server = new Server(
    { name, version },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  // Simple in-memory storage
  const memoryStore = new Map<string, any>();
  memoryStore.set('example', { message: 'Hello from example server!' });

  // Add basic tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'echo',
          description: 'Echo back the provided text',
          inputSchema: {
            type: 'object',
            properties: {
              text: { type: 'string', description: 'Text to echo back' },
            },
            required: ['text'],
          },
        },
      ],
    };
  });

  // Add basic resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
      resources: [
        {
          uri: 'memory://example',
          mimeType: 'application/json',
          name: 'Example Data',
          description: 'Example data stored in memory',
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'echo':
        const text = args?.text;
        if (typeof text !== 'string') {
          throw new McpError(ErrorCode.InvalidRequest, 'Text argument is required');
        }
        return {
          content: [{ type: 'text', text: `Echo: ${text}` }],
        };
      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  });

  // Handle resource reads
  server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest) => {
    const { uri } = request.params;

    if (uri === 'memory://example') {
      const data = memoryStore.get('example');
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }

    throw new McpError(ErrorCode.InvalidRequest, `Resource not found: ${uri}`);
  });

  return server;
}

/**
 * Start an example server with stdio transport
 */
export async function startExampleServer(name?: string, version?: string) {
  const server = createExampleServer(name, version);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  return server;
}
