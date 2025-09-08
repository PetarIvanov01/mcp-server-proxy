import * as fs from 'fs';
import * as path from 'path';

interface MCPServerConfig {
  type: string;
  command: string;
  args: string[];
  env: Record<string, string>;
}

interface MCPConfig {
  servers: {
    [key: string]: MCPServerConfig;
  };
}

console.log('🔍 Testing MCP Configuration...\n');

// Test 1: Check .vscode/mcp.json exists
console.log('1️⃣ Checking .vscode/mcp.json configuration...');
const mcpConfigPath = path.join(process.cwd(), '.vscode', 'mcp.json');

if (fs.existsSync(mcpConfigPath)) {
  console.log('✅ .vscode/mcp.json exists');

  try {
    const mcpConfig: MCPConfig = JSON.parse(
      fs.readFileSync(mcpConfigPath, 'utf8')
    );

    // Check server configuration
    if (mcpConfig.servers && mcpConfig.servers['kendo-react-assistant']) {
      console.log('✅ kendo-react-assistant server configured');

      const server = mcpConfig.servers['kendo-react-assistant'];

      // Check required fields
      if (server.type === 'stdio') {
        console.log('✅ Server type is stdio');
      } else {
        console.log('❌ Server type should be stdio');
      }

      if (server.command === 'npx') {
        console.log('✅ Command is npx');
      } else {
        console.log('❌ Command should be npx');
      }

      if (
        server.args &&
        server.args.includes('@progress/kendo-react-mcp@latest')
      ) {
        console.log('✅ MCP package specified correctly');
      } else {
        console.log('❌ MCP package not specified correctly');
      }

      // Check license configuration
      if (server.env && server.env.TELERIK_LICENSE_PATH) {
        console.log('✅ TELERIK_LICENSE_PATH configured');
        console.log(`   License path: ${server.env.TELERIK_LICENSE_PATH}`);

        // Check if license file exists
        const licensePath = path.resolve(
          process.cwd(),
          server.env.TELERIK_LICENSE_PATH
        );
        if (fs.existsSync(licensePath)) {
          console.log('✅ License file exists at specified path');
        } else {
          console.log('❌ License file not found at specified path');
        }
      } else if (server.env && server.env.TELERIK_LICENSE) {
        console.log('✅ TELERIK_LICENSE configured');
      } else {
        console.log('❌ No license configuration found');
      }
    } else {
      console.log('❌ kendo-react-assistant server not configured');
    }
  } catch (error) {
    console.log('❌ Error parsing mcp.json:', (error as Error).message);
  }
} else {
  console.log('❌ .vscode/mcp.json not found');
  console.log(
    '   Please create .vscode/mcp.json with the correct configuration'
  );
}

// Test 2: Check license file
console.log('\n2️⃣ Checking license file...');
const licensePath = path.join(process.cwd(), 'telerik-license.txt');

if (fs.existsSync(licensePath)) {
  const licenseContent = fs.readFileSync(licensePath, 'utf8');
  if (licenseContent.trim().length > 0) {
    console.log('✅ License file exists and has content');
    console.log(`   License file size: ${licenseContent.length} characters`);
  } else {
    console.log('❌ License file is empty');
  }
} else {
  console.log('❌ License file not found');
}

// Test 3: Check if old mcp.json exists (should be removed)
console.log('\n3️⃣ Checking for old mcp.json...');
const oldMcpPath = path.join(process.cwd(), 'mcp.json');
if (fs.existsSync(oldMcpPath)) {
  console.log('⚠️ Old mcp.json found at root level');
  console.log('   This should be removed - use .vscode/mcp.json instead');
} else {
  console.log('✅ No old mcp.json found at root level');
}

// Summary
console.log('\n📊 Configuration Summary:');
console.log(
  `   .vscode/mcp.json: ${fs.existsSync(mcpConfigPath) ? '✅' : '❌'}`
);
console.log(`   License file: ${fs.existsSync(licensePath) ? '✅' : '❌'}`);
console.log(`   Old mcp.json: ${fs.existsSync(oldMcpPath) ? '⚠️' : '✅'}`);

console.log('\n💡 Next steps:');
console.log(
  '   1. If all checks pass, run: npx tsx scripts/test-custom-mcp.ts'
);
console.log('   2. Start your app: npm run dev');
console.log('   3. Test component generation to verify MCP integration');

console.log('\n📚 Reference:');
console.log(
  '   Official docs: https://www.telerik.com/kendo-react-ui/components/mcp/'
);
console.log(
  '   Configuration should be in .vscode/mcp.json (not root mcp.json)'
);
