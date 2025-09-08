import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import * as path from 'path';
import * as fs from 'fs';
import { z } from 'zod';

interface TestResult {
  component: string;
  success: boolean;
  responseLength: number;
  response: string;
  error?: string;
  timestamp: string;
}

interface TestSummary {
  totalTests: number;
  successfulTests: number;
  failedTests: number;
  results: TestResult[];
  timestamp: string;
  duration: number;
}

/**
 * Top 20 most important and commonly used Kendo React components
 * Selected based on typical web application usage patterns and frequency of use
 */
const defaultComponentsToTest = [
  // Core UI Components (Essential for most apps)
  'Button', // Most basic interactive element
  'Input', // Text input field
  'TextBox', // Enhanced text input
  'TextArea', // Multi-line text input
  'Checkbox', // Boolean input
  'RadioButton', // Single choice input
  'Switch', // Toggle input

  // Form Components (Critical for data collection)
  'Form', // Form container and validation
  'DropDownList', // Single selection dropdown
  'ComboBox', // Editable dropdown
  'MultiSelect', // Multiple selection
  'DatePicker', // Date selection
  'NumericTextBox', // Number input

  // Data Display (Essential for showing information)
  'Grid', // Data table/grid
  'Typography', // Text styling and hierarchy
  'Card', // Content containers
  'Tooltip', // Additional information display

  // Layout & Navigation (Structure and navigation)
  'Menu', // Navigation menu
  'TabStrip', // Tabbed interface
  'Dialog' // Modal dialogs
];

// Use command line arguments if provided, otherwise use the default list
const componentsToTest =
  process.argv.length > 2 ? process.argv.slice(2) : defaultComponentsToTest;

init();

class TestMCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private isConnected = false;

  async initialize(): Promise<void> {
    try {
      // Initialize the MCP client
      this.client = new Client({
        name: 'kendo-react-test-client',
        version: '1.0.0'
      });

      // Set up the transport to the Kendo React MCP server
      this.transport = new StdioClientTransport({
        command: 'npx',
        args: ['-y', '@progress/kendo-react-mcp@latest'],
        env: {
          ...process.env,
          TELERIK_LICENSE_PATH: path.join(process.cwd(), 'telerik-license.txt')
        }
      });

      // Connect to the MCP server
      console.log('🔌 Connecting to MCP server...');
      await this.client.connect(this.transport);
      this.isConnected = true;
      console.log('✅ MCP client connected successfully');

      // List available tools for debugging
      const tools = await this.client.listTools();
      console.log('🛠️ Available tools:', tools.tools?.map((t) => t.name) || []);
    } catch (error) {
      console.error('❌ Failed to initialize MCP client:', error);
      throw error;
    }
  }

  async queryComponent(query: string, component: string): Promise<string> {
    if (!this.isConnected || !this.client) {
      throw new Error('MCP client not connected');
    }

    const toolName = 'kendo_react_assistant';
    console.log(`🔧 Calling MCP tool: ${toolName}`);

    try {
      const result = await this.client.callTool({
        name: toolName,
        arguments: {
          query: query,
          component: component
        }
      });

      console.log('📤 MCP Result:', result);

      const content = z
        .object({
          type: z.string(),
          text: z.string()
        })
        .array()
        .parse(result.content);

      const responseText =
        content
          ?.filter((content: any) => content.type === 'text')
          ?.map((content: any) => content.text)
          ?.join('\n') || '';

      console.log('📤 MCP Response length:', responseText.length);
      console.log(
        '📤 MCP Response preview:',
        responseText.substring(0, 500) + '...'
      );

      return responseText;
    } catch (error) {
      console.error('❌ MCP tool call failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      try {
        await this.client.close();
        console.log('🔌 MCP client disconnected');
      } catch (error) {
        console.error('❌ Error disconnecting MCP client:', error);
      }
    }
    this.client = null;
    this.transport = null;
    this.isConnected = false;
  }
}

runMultipleTests()
  .then((summary) => {
    console.log('\n📊 Test Summary:');
    console.log(`   Total Tests: ${summary.totalTests}`);
    console.log(`   Successful: ${summary.successfulTests}`);
    console.log(`   Failed: ${summary.failedTests}`);
    console.log(`   Duration: ${summary.duration}ms`);
    console.log('\n📋 Individual Results:');
    summary.results.forEach((result, index) => {
      const status = result.success ? '✅' : '❌';
      console.log(
        `   ${status} ${result.component}: ${result.responseLength} chars`
      );
      if (result.error) {
        console.log(`      Error: ${result.error}`);
      }
    });
    console.log(
      '\n   This test simulates how your merger agent uses the MCP server'
    );
    console.log('   If queries succeed, your app should work properly');

    saveTestResults(summary);
  })
  .catch((error) => {
    console.error('❌ Test failed:', (error as Error).message);
    process.exit(1);
  });

/**
 * Runs multiple component tests in parallel using Promise.all for faster execution.
 * This function creates a single MCP client connection and then runs all component
 * queries concurrently, which significantly reduces the total test time compared
 * to running them sequentially.
 */
async function runMultipleTests(): Promise<TestSummary> {
  const startTime = Date.now();
  const client = new TestMCPClient();
  const results: TestResult[] = [];

  try {
    // Initialize the client once for all tests
    await client.initialize();

    console.log(
      `\n🚀 Running ${componentsToTest.length} component tests in parallel...`
    );
    console.log(`📋 Components: ${componentsToTest.join(', ')}`);

    // Create test promises for all components
    const testPromises = componentsToTest.map(
      async (component): Promise<TestResult> => {
        try {
          console.log(`🧪 Starting test for: ${component}`);

          const query = `I need to implement a ${component} component in my React app. Please provide:
          - API Reference Items for the component
          - The most appropriate Kendo React component for this use case
          - Basic usage examples
          - Import statements needed
          `;

          const response = await client.queryComponent(query, component);

          console.log(
            `🔍 ${component} Response Preview:`,
            response.substring(0, 200) + '...'
          );

          const success = response && response.length > 0;
          const responseLength = response ? response.length : 0;

          const result: TestResult = {
            component,
            success: success as boolean,
            responseLength,
            response,
            timestamp: new Date().toISOString()
          };

          console.log(
            `✅ ${component} test completed: ${responseLength} chars`
          );
          return result;
        } catch (error) {
          const errorMessage = (error as Error).message;
          console.log(`❌ ${component} query failed:`, errorMessage);

          return {
            component,
            success: false,
            responseLength: 0,
            response: '',
            error: errorMessage,
            timestamp: new Date().toISOString()
          };
        }
      }
    );

    // Wait for all tests to complete with progress tracking
    console.log('\n⏳ Waiting for all parallel tests to complete...');
    const testResults = await Promise.allSettled(testPromises);

    // Process results and handle any rejections
    testResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error(
          `❌ Test for ${componentsToTest[index]} was rejected:`,
          result.reason
        );
        results.push({
          component: componentsToTest[index],
          success: false,
          responseLength: 0,
          response: '',
          error: `Promise rejected: ${result.reason}`,
          timestamp: new Date().toISOString()
        });
      }
    });

    console.log(`\n🎉 All ${componentsToTest.length} tests completed!`);
  } catch (error) {
    console.error('❌ Test initialization failed:', (error as Error).message);
  } finally {
    await client.disconnect();
  }

  const endTime = Date.now();
  const duration = endTime - startTime;

  const successfulTests = results.filter((r) => r.success).length;
  const failedTests = results.filter((r) => !r.success).length;

  const summary: TestSummary = {
    totalTests: componentsToTest.length,
    successfulTests,
    failedTests,
    results,
    timestamp: new Date().toISOString(),
    duration
  };

  return summary;
}

function init() {
  // Test 1: Check configuration
  console.log('1️⃣ Checking MCP configuration...');
  const licensePath = path.join(process.cwd(), 'telerik-license.txt');

  if (!fs.existsSync(licensePath)) {
    console.log('❌ telerik-license.txt not found');
    process.exit(1);
  }

  console.log('✅ Configuration files found');

  // Test 2: Simulate your custom MCP client
  console.log('\n2️⃣ Testing custom MCP client with multiple components...');
  console.log(`📋 Components to test: ${componentsToTest.join(', ')}`);
  console.log(`🔢 Total tests: ${componentsToTest.length}`);
}

function saveTestResults(summary: TestSummary): void {
  const testDir = path.join(process.cwd(), '.kendo-mcp-tests');

  // Create directory if it doesn't exist
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Generate base timestamp for this test run
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  // Save each component result in a separate file
  summary.results.forEach((result, index) => {
    const filename = `result-${result.component}-${timestamp}.md`;
    const filepath = path.join(testDir, filename);

    // Write the individual component result
    fs.writeFileSync(filepath, result.response);
    console.log(`📄 ${result.component} results saved to: ${filepath}`);
  });

  // Also save a summary file with all results combined
  const summaryFilename = `summary-${timestamp}.json`;
  const summaryFilepath = path.join(testDir, summaryFilename);

  const summaryData = {
    timestamp: summary.timestamp,
    totalTests: summary.totalTests,
    successfulTests: summary.successfulTests,
    failedTests: summary.failedTests,
    duration: summary.duration,
    results: summary.results.map((r) => ({
      component: r.component,
      success: r.success,
      responseLength: r.responseLength,
      error: r.error,
      timestamp: r.timestamp
    }))
  };

  fs.writeFileSync(summaryFilepath, JSON.stringify(summaryData, null, 2));
  console.log(`\n📊 Test summary saved to: ${summaryFilepath}`);
}
