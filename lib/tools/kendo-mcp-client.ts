import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { z } from 'zod';
import path from 'path';
import "@progress/kendo-react-mcp/dist/index.js";

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

export class KendoMCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private isConnected = false;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.initializationPromise = this.initializeMCPConnection();
  }

  private async initializeMCPConnection(): Promise<void> {
    try {
      const licensePath = path.join(process.cwd(), 'telerik-license.txt');

      // Initialize the MCP client
      this.client = new Client({
        name: 'kendo-react-client',
        version: '1.0.0'
      });

      // this.transport = new StdioClientTransport({
      //   command: 'npx',
      //   args: ['-y', '@progress/kendo-react-mcp@1.1.2'],
      //   env: {
      //     ...process.env,
      //     TELERIK_LICENSE_PATH: licensePath
      //   }
      // });

      const mcpPath = path.resolve('kendo-react-mcp/dist/index.js');

      this.transport = new StdioClientTransport({
        command: 'node',
        args: [mcpPath],
        env: {
          ...process.env,
          TELERIK_LICENSE_PATH: licensePath
        }
      });

      // Connect to the MCP server
      console.log('🔌 Kendo MCP Client: Connecting to MCP server...');
      await this.client.connect(this.transport);
      this.isConnected = true;
    } catch (error) {
      this.isConnected = false;
      throw error;
    }
  }

  async queryKendoComponent(
    query: string,
    component: string = 'General'
  ): Promise<string> {
    if (this.initializationPromise) {
      try {
        await this.initializationPromise;
      } catch (error) {
        console.warn(
          '⚠️ Kendo MCP Client: Initialization failed, returning empty response'
        );
        return '';
      }
    }

    if (!this.isConnected || !this.client) {
      console.warn(
        '⚠️ Kendo MCP Client: Not connected, returning empty response'
      );
      return '';
    }

    try {
      const result = await this.client.callTool({
        name: 'kendo_react_assistant',
        arguments: {
          query,
          component
        }
      });
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

      console.log('📤 Kendo MCP Client: Response length:', responseText.length);
      console.log(
        '📤 Kendo MCP Client: Response preview:',
        responseText.substring(0, 200) + '...'
      );

      return responseText;
    } catch (error) {
      console.error('❌ Kendo MCP Client: Query failed:', error);
      return '';
    }
  }

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

  isReady(): boolean {
    return this.isConnected && this.client !== null;
  }

  async disconnect(): Promise<void> {
    if (this.client && this.isConnected) {
      try {
        await this.client.close();
        console.log('🔌 Kendo MCP Client: Disconnected');
      } catch (error) {
        console.error('❌ Kendo MCP Client: Error disconnecting:', error);
      }
    }
    this.client = null;
    this.transport = null;
    this.isConnected = false;
  }
}

export function getKendoMCPClient(): KendoMCPClient {
  return new KendoMCPClient();
}
