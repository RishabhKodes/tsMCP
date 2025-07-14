/**
 * MCP TypeScript Boilerplate
 *
 * This file exports the main components for creating MCP servers and clients.
 * You can import these in your own projects or extend them as needed.
 */

// Re-export MCP SDK types and utilities for convenience
export {
  Server,
  type ServerOptions,
} from '@modelcontextprotocol/sdk/server/index.js';

export {
  Client,
  type ClientOptions,
} from '@modelcontextprotocol/sdk/client/index.js';

export {
  StdioServerTransport,
} from '@modelcontextprotocol/sdk/server/stdio.js';

export {
  StdioClientTransport,
} from '@modelcontextprotocol/sdk/client/stdio.js';

export {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ErrorCode,
  McpError,
  type CallToolRequest,
  type ReadResourceRequest,
  type Tool,
  type Resource,
} from '@modelcontextprotocol/sdk/types.js';

// Example implementations
export { createExampleServer } from './utils/createExampleServer.js';
export { createExampleClient } from './utils/createExampleClient.js';

// Type definitions for common use cases
export interface MemoryStore {
  get(key: string): any;
  set(key: string, value: any): void;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
}

export interface ToolHandler {
  name: string;
  description: string;
  inputSchema: object;
  handler: (args: any) => Promise<{ content: Array<{ type: string; text: string }> }>;
}

export interface ResourceHandler {
  uri: string;
  name: string;
  description: string;
  mimeType: string;
  handler: () => Promise<{ contents: Array<{ uri: string; mimeType: string; text: string }> }>;
}
