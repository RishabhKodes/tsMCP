import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

/**
 * Example MCP Client
 * This demonstrates how to connect to an MCP server and interact with it
 */

async function main() {
  // Create a client instance
  const client = new Client(
    {
      name: 'mcp-typescript-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  // Connect to the server using stdio transport
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['build/server.js'],
  });

  try {
    // Connect to the server
    await client.connect(transport);
    console.log('Connected to MCP server');

    // List available tools
    console.log('\n=== Available Tools ===');
    const toolsResult = await client.listTools();
    toolsResult.tools.forEach((tool) => {
      console.log(`- ${tool.name}: ${tool.description}`);
    });

    // List available resources
    console.log('\n=== Available Resources ===');
    const resourcesResult = await client.listResources();
    resourcesResult.resources.forEach((resource) => {
      console.log(`- ${resource.uri}: ${resource.description}`);
    });

    // Example: Call the echo tool
    console.log('\n=== Testing Echo Tool ===');
    const echoResult = await client.callTool({
      name: 'echo',
      arguments: {
        text: 'Hello from MCP client!',
      },
    });
    console.log('Echo result:', (echoResult.content as any)[0]);

    // Example: Call the calculate tool
    console.log('\n=== Testing Calculate Tool ===');
    const calcResult = await client.callTool({
      name: 'calculate',
      arguments: {
        operation: 'add',
        a: 10,
        b: 5,
      },
    });
        console.log('Calculate result:', (calcResult.content as any)[0]);

    // Example: Read a resource
    console.log('\n=== Reading Config Resource ===');
    const configResource = await client.readResource({
      uri: 'memory://config',
    });
    console.log('Config resource:', configResource.contents[0]);

    // Example: Use memory tools
    console.log('\n=== Testing Memory Tools ===');

    // Set a value
    const setResult = await client.callTool({
      name: 'set_memory',
      arguments: {
        key: 'test',
        value: JSON.stringify({ message: 'Hello from client', timestamp: Date.now() }),
      },
    });
    console.log('Set result:', (setResult.content as any)[0]);

    // Get the value back
    const getResult = await client.callTool({
      name: 'get_memory',
      arguments: {
        key: 'test',
      },
    });
    console.log('Get result:', (getResult.content as any)[0]);

  } catch (error) {
    console.error('Client error:', error);
  } finally {
    // Clean up
    await client.close();
    console.log('\nClient disconnected');
  }
}

// Handle process cleanup
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  process.exit(0);
});

main().catch((error) => {
  console.error('Client failed to start:', error);
  process.exit(1);
});
