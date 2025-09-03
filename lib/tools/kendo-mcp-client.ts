import { spawn } from 'child_process';
import { z } from 'zod';

const GrpcErrorCodes = {
  UNAUTHENTICATED: 16,
  RESOURCE_EXHAUSTED: 8,
  PERMISSION_DENIED: 7
};

const LICENSE_ENV_VARS = ['TELERIK_LICENSE', 'KENDO_UI_LICENSE'];
const LICENSE_PATH_ENV_VAR = 'TELERIK_LICENSE_PATH';

const kendoMCPResponseSchema = z.object({
  content: z.array(
    z.object({
      type: z.string(),
      text: z.string()
    })
  )
});

const mcpResponseSchema = z.object({
  result: kendoMCPResponseSchema
});

export interface KendoMCPQuery {
  query: string;
  component: string;
}

export interface KendoMCPResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

/**
 * Client for interacting with the Kendo React MCP server
 * This client spawns the MCP server process and communicates with it
 * to get Kendo UI React component documentation and context
 */
export class KendoMCPClient {
  private mcpProcess: any = null;
  private isConnected = false;

  constructor() {
    this.initializeMCPConnection();
  }

  /**
   * Check if license file exists and load it
   */
  private checkLicenseConfiguration(): boolean {
    const fs = require('fs');
    const path = require('path');

    const licensePath = path.join(process.cwd(), 'telerik-license.txt');

    if (fs.existsSync(licensePath)) {
      try {
        const licenseContent = fs.readFileSync(licensePath, 'utf8');
        if (licenseContent.trim().length > 0) {
          console.log(`✅ License file found: ${licensePath}`);
          return true;
        } else {
          console.warn(`⚠️ License file exists but is empty: ${licensePath}`);
        }
      } catch (error) {
        console.warn(`⚠️ Error reading license file ${licensePath}:`, error);
      }
    } else {
      console.warn(`⚠️ License file not found: ${licensePath}`);
    }

    return false;
  }

  /**
   * Initialize connection to the Kendo MCP server
   */
  private async initializeMCPConnection(): Promise<void> {
    try {
      // Check license configuration first
      if (!this.checkLicenseConfiguration()) {
        console.warn(
          '⚠️ License not configured, MCP client may not work properly'
        );
      }

      // Use the license file path
      const fs = require('fs');
      const path = require('path');
      const licensePath = path.join(process.cwd(), 'telerik-license.txt');

      // Spawn the MCP server process using the official package
      this.mcpProcess = spawn(
        'npx',
        ['-y', '@progress/kendo-react-mcp@latest'],
        {
          stdio: ['pipe', 'pipe', 'pipe'],
          cwd: process.cwd(),
          env: {
            ...process.env,
            // Set the license file path
            TELERIK_LICENSE_PATH: licensePath
          }
        }
      );

      this.mcpProcess.on('error', (error: Error) => {
        console.error('❌ Kendo MCP Client: Process error:', error);
        this.isConnected = false;
      });

      this.mcpProcess.on('exit', (code: number) => {
        console.log(`🔌 Kendo MCP Client: Process exited with code ${code}`);
        this.isConnected = false;
      });

      // Wait a bit for the process to initialize
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.isConnected = true;
      console.log('✅ Kendo MCP Client: Connected to MCP server');
    } catch (error) {
      console.error('❌ Kendo MCP Client: Failed to initialize:', error);
      this.isConnected = false;
    }
  }

  /**
   * Query the Kendo MCP server for component documentation
   */
  async queryKendoComponent(
    query: string,
    component: string = 'General'
  ): Promise<string> {
    if (!this.isConnected || !this.mcpProcess) {
      console.warn(
        '⚠️ Kendo MCP Client: Not connected, returning empty response'
      );
      return '';
    }

    try {
      // Handle Grid component mapping as per official MCP server
      if (component === 'Grid') {
        component = 'DataGrid';
      }

      const mcpRequest = {
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: 'kendo_react_assistant',
          arguments: {
            query,
            component
          }
        }
      };

      return new Promise((resolve, reject) => {
        let responseData = '';
        let errorData = '';

        const timeout = setTimeout(() => {
          reject(new Error('MCP request timeout'));
        }, 30000); // 30 second timeout

        this.mcpProcess.stdout.once('data', (data: Buffer) => {
          clearTimeout(timeout);
          responseData = data.toString();

          try {
            const response = JSON.parse(responseData);

            // Handle error responses - matching official MCP server error handling
            if (response.error) {
              const error = response.error;
              console.error('❌ Kendo MCP Client: MCP Error:', error);

              // Handle specific error codes as per official MCP server
              if (error.code === GrpcErrorCodes.UNAUTHENTICATED) {
                console.error(
                  '❌ Authentication Error: Please verify the Telerik License Key is valid.'
                );
              } else if (error.code === GrpcErrorCodes.RESOURCE_EXHAUSTED) {
                console.error(
                  '❌ Quota Exceeded: Upgrade to subscription licensing for full access.'
                );
              } else if (error.code === GrpcErrorCodes.PERMISSION_DENIED) {
                console.error(
                  '❌ Permission Denied: Please verify you have a valid Kendo UI for React license key.'
                );
              }

              resolve('');
              return;
            }

            // Parse the response according to official MCP server format
            if (response.result && response.result.content) {
              const parsedResponse = mcpResponseSchema.parse(response);
              const textContent = parsedResponse.result.content
                .map((item) => item.text)
                .join('\n\n');
              resolve(textContent);
            } else {
              resolve('');
            }
          } catch (parseError) {
            console.error(
              '❌ Kendo MCP Client: Failed to parse response:',
              parseError
            );
            resolve('');
          }
        });

        this.mcpProcess.stderr.once('data', (data: Buffer) => {
          errorData = data.toString();
          console.error('❌ Kendo MCP Client: Process error:', errorData);
        });

        // Send the request
        this.mcpProcess.stdin.write(JSON.stringify(mcpRequest) + '\n');
      });
    } catch (error) {
      console.error('❌ Kendo MCP Client: Query failed:', error);
      return '';
    }
  }

  /**
   * Get documentation for multiple components
   */
  async getMultipleComponentDocs(
    components: string[],
    baseQuery: string = 'documentation and usage examples'
  ): Promise<Record<string, string>> {
    const results: Record<string, string> = {};

    for (const component of components) {
      try {
        const docs = await this.queryKendoComponent(baseQuery, component);
        results[component] = docs;
      } catch (error) {
        console.error(
          `❌ Kendo MCP Client: Failed to get docs for ${component}:`,
          error
        );
        results[component] = '';
      }
    }

    return results;
  }

  /**
   * Check if the MCP client is connected and ready
   */
  isReady(): boolean {
    return this.isConnected && this.mcpProcess;
  }

  /**
   * Disconnect from the MCP server
   */
  disconnect(): void {
    if (this.mcpProcess) {
      this.mcpProcess.kill();
      this.mcpProcess = null;
      this.isConnected = false;
      console.log('🔌 Kendo MCP Client: Disconnected');
    }
  }
}

// Singleton instance
let kendoMCPClient: KendoMCPClient | null = null;

/**
 * Get the singleton instance of the Kendo MCP client
 */
export function getKendoMCPClient(): KendoMCPClient {
  if (!kendoMCPClient) {
    kendoMCPClient = new KendoMCPClient();
  }
  return kendoMCPClient;
}

/**
 * Alternative approach: Direct HTTP client for MCP server
 * This can be used if the MCP server is running as a separate service
 */
export class KendoMCPHTTPClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  async queryKendoComponent(
    query: string,
    component: string = 'General'
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/mcp/kendo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query,
          component
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.content || '';
    } catch (error) {
      console.error('❌ Kendo MCP HTTP Client: Query failed:', error);
      return '';
    }
  }
}
