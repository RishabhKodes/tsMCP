#!/usr/bin/env node

/**
 * Quick Start Script for MCP TypeScript Boilerplate
 *
 * This script demonstrates how to:
 * 1. Create a simple MCP server
 * 2. Add custom tools
 * 3. Test the server with a client
 *
 * Run with: npm run build && node build/quickstart.js
 */

import { createExampleServer, startExampleServer } from './utils/createExampleServer.js';
import { runExampleClient } from './utils/createExampleClient.js';

async function quickStartDemo() {
  console.log('🚀 MCP TypeScript Boilerplate - Quick Start Demo\n');

  try {
    // Example 1: Create and configure a server
    console.log('1. Creating example server...');
    const server = createExampleServer('quickstart-server', '1.0.0');
    console.log('   ✅ Server created with default tools and resources\n');

    // Example 2: Show how to add custom functionality
    console.log('2. Server capabilities:');
    console.log('   📚 Resources: memory://example');
    console.log('   🔧 Tools: echo');
    console.log('   🔒 Transport: stdio\n');

    // Example 3: Instructions for testing
    console.log('3. To test this server:');
    console.log('   • Build: npm run build');
    console.log('   • Start server: npm run start:server');
    console.log('   • Test with client: npm run start:client\n');

    // Example 4: Integration instructions
    console.log('4. To integrate with Claude Desktop:');
    console.log('   • Copy claude_desktop_config.example.json');
    console.log('   • Update the path to point to your build/server.js');
    console.log('   • Restart Claude Desktop\n');

    console.log('5. Next steps:');
    console.log('   • Customize tools in src/server.ts');
    console.log('   • Add your own resources');
    console.log('   • Implement error handling');
    console.log('   • Add persistent storage');
    console.log('   • Deploy to production\n');

    console.log('📖 Check the README.md for detailed documentation');
    console.log('🎉 Happy coding with MCP!');

  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  quickStartDemo().catch(console.error);
}

export { quickStartDemo };
