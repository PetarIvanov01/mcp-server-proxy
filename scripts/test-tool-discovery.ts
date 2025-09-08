import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

interface MCPRequest {
  jsonrpc: string;
  id: number;
  method: string;
  params: Record<string, any>;
}

interface MCPTool {
  name: string;
  description?: string;
}

interface MCPResponse {
  result?: {
    tools?: MCPTool[];
  };
  error?: {
    code: number;
    message: string;
  };
}

console.log('🔍 Testing MCP Tool Discovery...\n');

// Test 1: Check configuration
console.log('1️⃣ Checking MCP configuration...');
const licensePath = path.join(process.cwd(), 'telerik-license.txt');

if (!fs.existsSync(licensePath)) {
  console.log('❌ telerik-license.txt not found');
  process.exit(1);
}

console.log('✅ License file found');

// Test 2: Start MCP server and discover tools
console.log('\n2️⃣ Starting MCP server and discovering tools...');

const mcpProcess: ChildProcess = spawn(
  'npx',
  ['-y', '@progress/kendo-react-mcp@latest'],
  {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd(),
    env: {
      ...process.env,
      TELERIK_LICENSE_PATH: licensePath
    }
  }
);

let toolsDiscovered = false;
let discoveredTools: MCPTool[] = [];

mcpProcess.stdout?.on('data', (data: Buffer) => {
  const output = data.toString();
  console.log('📤 MCP Output:', output);

  // Try to parse JSON response
  try {
    const lines = output.split('\n').filter((line) => line.trim());
    for (const line of lines) {
      try {
        const response: MCPResponse = JSON.parse(line);
        if (response.result && response.result.tools) {
          toolsDiscovered = true;
          discoveredTools = response.result.tools;
          console.log('✅ Tools discovered successfully!');
          console.log('📋 Available tools:');
          response.result.tools.forEach((tool) => {
            console.log(
              `   - ${tool.name}: ${tool.description || 'No description'}`
            );
          });
        }
      } catch (e) {
        // Not JSON, continue
      }
    }
  } catch (e) {
    // Not JSON, continue
  }
});

mcpProcess.stderr?.on('data', (data: Buffer) => {
  console.log('📥 MCP Error:', data.toString());
});

mcpProcess.on('close', (code: number | null) => {
  console.log(`\n🔌 MCP server process exited with code ${code}`);

  if (toolsDiscovered) {
    console.log('✅ Tool discovery test PASSED');
    console.log(`   Discovered ${discoveredTools.length} tools`);
  } else {
    console.log('❌ Tool discovery test FAILED');
    console.log('   No tools were discovered');
  }
});

// Send tool discovery request after a short delay
setTimeout(() => {
  if (mcpProcess.stdin && !mcpProcess.stdin.destroyed) {
    const listToolsRequest: MCPRequest = {
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/list',
      params: {}
    };

    console.log('📤 Sending tool discovery request...');
    mcpProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n');

    // Close after response or timeout
    setTimeout(() => {
      if (!toolsDiscovered) {
        console.log('⚠️ No tools discovered within timeout');
      }
      mcpProcess.kill();
    }, 10000);
  }
}, 2000);

// Handle process errors
mcpProcess.on('error', (error: Error) => {
  console.log('❌ MCP process error:', error.message);
  process.exit(1);
});
