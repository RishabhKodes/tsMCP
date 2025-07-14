#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  McpError,
  ReadResourceRequestSchema,
  ReadResourceRequest,
  CallToolRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

const server = new Server(
  {
    name: 'tsMCP',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Tool schema validation
const CalculateInputSchema = z.object({
  operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
  a: z.number(),
  b: z.number(),
});

// Sample in-memory data store
const memoryStore = new Map<string, any>();
memoryStore.set('config', { theme: 'dark', language: 'en' });
memoryStore.set('data', { users: ['alice', 'bob'], tasks: ['task1', 'task2'] });

/**
 * Handler for listing available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'memory://config',
        mimeType: 'application/json',
        name: 'Configuration Settings',
        description: 'Application configuration data',
      },
      {
        uri: 'memory://data',
        mimeType: 'application/json',
        name: 'Application Data',
        description: 'Sample application data including users and tasks',
      },
    ],
  };
});

/**
 * Handler for reading specific resources
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest) => {
  const { uri } = request.params;

  if (!uri.startsWith('memory://')) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Unsupported URI scheme: ${uri}`
    );
  }

  const key = uri.replace('memory://', '');
  const data = memoryStore.get(key);

  if (!data) {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Resource not found: ${uri}`
    );
  }

  return {
    contents: [
      {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
});

/**
 * Handler for listing available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'calculate',
        description: 'Perform basic arithmetic operations',
        inputSchema: {
          type: 'object',
          properties: {
            operation: {
              type: 'string',
              enum: ['add', 'subtract', 'multiply', 'divide'],
              description: 'The arithmetic operation to perform',
            },
            a: {
              type: 'number',
              description: 'First number',
            },
            b: {
              type: 'number',
              description: 'Second number',
            },
          },
          required: ['operation', 'a', 'b'],
        },
      },
      {
        name: 'echo',
        description: 'Echo back the provided text',
        inputSchema: {
          type: 'object',
          properties: {
            text: {
              type: 'string',
              description: 'Text to echo back',
            },
          },
          required: ['text'],
        },
      },
      {
        name: 'get_memory',
        description: 'Get value from memory store',
        inputSchema: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description: 'Key to retrieve from memory',
            },
          },
          required: ['key'],
        },
      },
      {
        name: 'set_memory',
        description: 'Set value in memory store',
        inputSchema: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description: 'Key to store in memory',
            },
            value: {
              type: 'string',
              description: 'Value to store (JSON string)',
            },
          },
          required: ['key', 'value'],
        },
      },
    ],
  };
});

/**
 * Handler for tool execution
 */
server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'calculate': {
        const { operation, a, b } = CalculateInputSchema.parse(args);
        let result: number = 0;

        switch (operation) {
          case 'add':
            result = a + b;
            break;
          case 'subtract':
            result = a - b;
            break;
          case 'multiply':
            result = a * b;
            break;
          case 'divide':
            if (b === 0) {
              throw new Error('Division by zero is not allowed');
            }
            result = a / b;
            break;
        }

        return {
          content: [
            {
              type: 'text',
              text: `Result: ${a} ${operation} ${b} = ${result}`,
            },
          ],
        };
      }

      case 'echo': {
        const text = args?.text;
        if (typeof text !== 'string') {
          throw new Error('Text argument is required and must be a string');
        }

        return {
          content: [
            {
              type: 'text',
              text: `Echo: ${text}`,
            },
          ],
        };
      }

      case 'get_memory': {
        const key = args?.key;
        if (typeof key !== 'string') {
          throw new Error('Key argument is required and must be a string');
        }

        const value = memoryStore.get(key);
        return {
          content: [
            {
              type: 'text',
              text: value ? JSON.stringify(value, null, 2) : 'Key not found',
            },
          ],
        };
      }

      case 'set_memory': {
        const { key, value } = args as { key: string; value: string };
        if (typeof key !== 'string' || typeof value !== 'string') {
          throw new Error('Key and value arguments are required and must be strings');
        }

        try {
          const parsedValue = JSON.parse(value);
          memoryStore.set(key, parsedValue);
          return {
            content: [
              {
                type: 'text',
                text: `Successfully set ${key} = ${value}`,
              },
            ],
          };
        } catch (error) {
          throw new Error('Value must be valid JSON');
        }
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new McpError(ErrorCode.InternalError, errorMessage);
  }
});

/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP TypeScript Server running on stdio');
}

main().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});
