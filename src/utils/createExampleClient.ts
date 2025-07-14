import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

/**
 * Creates a pre-configured MCP client for testing
 */
export function createExampleClient(name: string = 'example-client', version: string = '1.0.0') {
  const client = new Client(
    { name, version },
    {
      capabilities: {},
    }
  );

  return client;
}

/**
 * Connect to a server and run example interactions
 */
export async function runExampleClient(serverScriptPath?: string): Promise<void> {
  const client = createExampleClient();

  try {
    // Connect to server if path provided
    if (serverScriptPath) {
      const transport = new StdioClientTransport({
        command: 'node',
        args: [serverScriptPath],
      });

      await client.connect(transport);
    }

    console.log('Connected to MCP server');

    // Example interactions
    console.log('\n=== Listing Tools ===');
    const tools = await client.listTools();
    tools.tools.forEach((tool: any) => {
      console.log(`- ${tool.name}: ${tool.description}`);
    });

    console.log('\n=== Listing Resources ===');
    const resources = await client.listResources();
    resources.resources.forEach((resource: any) => {
      console.log(`- ${resource.uri}: ${resource.description}`);
    });

    // Try to call echo tool if available
    const echoTool = tools.tools.find((t: any) => t.name === 'echo');
    if (echoTool) {
      console.log('\n=== Testing Echo Tool ===');
      const result = await client.callTool({
        name: 'echo',
        arguments: { text: 'Hello from example client!' },
      });
      console.log('Result:', (result.content as any)[0]);
    }

  } catch (error) {
    console.error('Client error:', error);
  } finally {
    await client.close();
    console.log('Client disconnected');
  }
}

/**
 * Simple helper to test server-client communication
 */
export async function testServerClient(serverPath: string): Promise<boolean> {
  try {
    await runExampleClient(serverPath);
    return true;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
}
