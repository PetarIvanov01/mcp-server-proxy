import { getKendoMCPClient } from '../lib/tools/kendo-mcp-client';

console.log('🧪 Testing MCP Client for Browser Integration...\n');

async function testMCPClient() {
  try {
    console.log('1️⃣ Initializing MCP Client...');
    const client = getKendoMCPClient();

    // Wait a bit for initialization
    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log('2️⃣ Checking client status...');
    if (client.isReady()) {
      console.log('✅ MCP Client is ready');
    } else {
      console.log('❌ MCP Client is not ready');
      return;
    }

    console.log('3️⃣ Testing Button component query...');
    const testQuery = 'Provide basic usage example for Button component';
    const response = await client.queryKendoComponent(testQuery, 'Button');

    if (response && response.length > 0) {
      console.log('✅ Button component query successful');
      console.log(`   Response length: ${response.length} characters`);
      console.log('   Response preview:', response.substring(0, 200) + '...');
    } else {
      console.log('❌ Button component query failed - no response');
    }

    console.log('4️⃣ Testing DataGrid component query...');
    const gridResponse = await client.queryKendoComponent(
      'Show me DataGrid usage examples',
      'DataGrid'
    );

    if (gridResponse && gridResponse.length > 0) {
      console.log('✅ DataGrid component query successful');
      console.log(`   Response length: ${gridResponse.length} characters`);
    } else {
      console.log('❌ DataGrid component query failed - no response');
    }

    console.log('\n🎉 MCP Client test completed!');
    console.log(
      '   If both tests passed, the MCP integration should work in the browser.'
    );
    console.log('   You can now visit /example to test the full interface.');
  } catch (error) {
    console.error('❌ MCP Client test failed:', (error as Error).message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Check that telerik-license.txt exists and is valid');
    console.log('   - Ensure you have internet connection for MCP server');
    console.log(
      '   - Try running: npx @progress/kendo-react-mcp@latest --help'
    );
  } finally {
    // Clean up
    const client = getKendoMCPClient();
    client.disconnect();
  }
}

// Run the test
testMCPClient();
