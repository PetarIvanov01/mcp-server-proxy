import { spawn, ChildProcess } from 'child_process';
import { ACT_TO_KENDO_MAPPINGS } from '../lib/kendo-components';

interface MCPRequest {
  jsonrpc: string;
  id: number;
  method: string;
  params: {
    name: string;
    arguments: {
      query: string;
      component: string;
    };
  };
}

class TestMCPClient {
  private mcpProcess: ChildProcess | null = null;
  private isConnected = false;

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('🔧 Initializing MCP client...');

      // Start the MCP server process
      this.mcpProcess = spawn('npx', ['@progress/kendo-react-mcp'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env }
      });

      if (!this.mcpProcess) {
        reject(new Error('Failed to start MCP process'));
        return;
      }

      // Handle process errors
      this.mcpProcess.on('error', (error) => {
        console.error('❌ MCP Process error:', error);
        reject(error);
      });

      // Handle process exit
      this.mcpProcess.on('exit', (code) => {
        console.log(`🔌 MCP Process exited with code ${code}`);
        this.isConnected = false;
      });

      // Wait for the process to be ready
      setTimeout(() => {
        this.isConnected = true;
        console.log('✅ MCP client initialized');
        resolve();
      }, 2000);
    });
  }

  async queryComponent(query: string, component: string): Promise<string> {
    if (!this.isConnected || !this.mcpProcess) {
      throw new Error('MCP client not connected');
    }

    const toolName = 'kendo_react_assistant';
    console.log(`🔧 Using MCP tool: ${toolName}`);

    return new Promise((resolve, reject) => {
      const mcpRequest: MCPRequest = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: {
            query: query,
            component: component
          }
        }
      };

      const timeout = setTimeout(() => {
        reject(new Error('MCP request timeout'));
      }, 30000);

      this.mcpProcess!.stdout!.once('data', (data: Buffer) => {
        clearTimeout(timeout);
        const responseData = data.toString();
        resolve(responseData);
      });

      this.mcpProcess!.stderr!.once('data', (data: Buffer) => {
        console.error('❌ MCP Process error:', data.toString());
      });

      // Send the request
      this.mcpProcess!.stdin!.write(JSON.stringify(mcpRequest) + '\n');
    });
  }

  disconnect(): void {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
      this.mcpProcess = null;
      this.isConnected = false;
    }
  }
}

// Test structure with ACT components
const testStructure = {
  structure: {
    component: 'container',
    description: 'The root container for the Button Showcase page structure.',
    children: [
      {
        component: 'header',
        description:
          "The header section containing the application's branding and title.",
        children: [
          {
            component: 'logo',
            description:
              'Displays the logo of the application, providing branding.',
            children: ''
          },
          {
            component: 'title',
            description: "Displays the title of the page: 'Button Showcase'.",
            children: ''
          }
        ]
      },
      {
        component: 'section',
        description:
          'The section dedicated to displaying the button being showcased.',
        children: [
          {
            component: 'button',
            description:
              'The actual button being showcased with customizable properties.',
            children: ''
          },
          {
            component: 'buttonStateIndicator',
            description:
              'Indicates the current state of the showcased button (enabled/disabled).',
            children: ''
          }
        ]
      },
      {
        component: 'section',
        description: "The section for configuring the button's properties.",
        children: [
          {
            component: 'textInput',
            description:
              'Allows the user to input a custom label for the button.',
            children: ''
          },
          {
            component: 'dropdown',
            description:
              'Provides options to select the button type (submit, reset, etc.).',
            children: ''
          },
          {
            component: 'colorPicker',
            description: "Enables color selection for the button's background.",
            children: ''
          }
        ]
      },
      {
        component: 'footer',
        description: 'The footer section containing copyright and links.',
        children: [
          {
            component: 'copyrightNotice',
            description: 'Displays the copyright text and year.',
            children: ''
          },
          {
            component: 'link',
            description: 'Provides a link to related documentation or pages.',
            children: ''
          }
        ]
      }
    ]
  }
};

// Extract and map components
const extractAndMapComponents = (
  structure: any
): Array<{ act: string; kendo: string }> => {
  const components: Array<{ act: string; kendo: string }> = [];

  const traverse = (node: any) => {
    if (node.component) {
      const actComponent = node.component.toLowerCase();
      const mapping =
        ACT_TO_KENDO_MAPPINGS[
          actComponent as keyof typeof ACT_TO_KENDO_MAPPINGS
        ];
      if (mapping?.component) {
        components.push({ act: actComponent, kendo: mapping.component });
      }
    }
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(traverse);
    }
  };
  traverse(structure);

  // Remove duplicates based on kendo component name
  const uniqueComponents = components.filter(
    (comp, index, self) =>
      index === self.findIndex((c) => c.kendo === comp.kendo)
  );
  return uniqueComponents;
};

async function runTest(): Promise<void> {
  console.log('🚀 Starting Mapped Components Test...\n');

  const client = new TestMCPClient();

  try {
    await client.initialize();

    const mappedComponents = extractAndMapComponents(testStructure.structure);
    console.log('🔍 Mapped components:', mappedComponents);

    // Test a few key components
    const testComponents = mappedComponents.slice(0, 3); // Test first 3 components

    for (const { act, kendo } of testComponents) {
      console.log(`\n🔍 Testing ${act} -> ${kendo}`);

      const query = `#kendo-react-assistant Create a basic ${kendo} component with sample data and show me the complete implementation including imports, props, and styling.`;

      try {
        const response = await client.queryComponent(query, kendo);
        console.log(`✅ Got response for ${kendo} (${response.length} chars)`);
        console.log('📄 Response preview:', response.substring(0, 200) + '...');
      } catch (error) {
        console.error(`❌ Failed to get response for ${kendo}:`, error);
      }
    }

    console.log('\n🎉 Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    client.disconnect();
  }
}

// Run the test
runTest().catch(console.error);
