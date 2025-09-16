import { z } from 'zod';
import { kendoReactAssistantTool, KENDO_COMPONENTS } from './kendo-mcp-server';

// Hardcoded MCP proxy URL (replace with your deployed proxy URL)

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
  private isConnected = false;
  private initializationPromise: Promise<void> | null = null;
  private remoteUrl: string | null = null;
  private remoteToken: string | null = null;

  constructor() {
    this.remoteUrl = process.env.MCP_REMOTE_URL || null;
    this.remoteToken = process.env.KENDO_MCP_REMOTE_TOKEN || null;
    this.initializationPromise = this.initializeMCPConnection();
  }

  private async initializeMCPConnection(): Promise<void> {
    try {
      if (this.remoteUrl) {
        console.log(
          '🔌 Kendo MCP Client: Using remote MCP proxy at',
          this.remoteUrl
        );
        this.isConnected = true;
        return;
      }

      // The MCP server is already initialized when imported (local direct tool mode)
      console.log('🔌 Kendo MCP Client: Using direct MCP server connection...');
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

    if (!this.isConnected) {
      console.warn(
        '⚠️ Kendo MCP Client: Not connected, returning empty response'
      );
      return '';
    }

    try {
      // Remote HTTP proxy mode
      if (this.remoteUrl) {
        const response = await fetch(
          `${this.remoteUrl.replace(/\/$/, '')}/mcp/query`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(this.remoteToken
                ? { Authorization: `Bearer ${this.remoteToken}` }
                : {})
            },
            body: JSON.stringify({ query, component })
          }
        );

        if (!response.ok) {
          const text = await response.text().catch(() => '');
          console.error(
            '❌ Kendo MCP Client: Remote proxy error',
            response.status,
            text
          );
          return '';
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data: any = await response.json();
          if (typeof data === 'string') return data;
          const content = Array.isArray(data?.content) ? data.content : [];
          const responseText =
            content
              ?.filter(
                (c: any) => c && c.type === 'text' && typeof c.text === 'string'
              )
              ?.map((c: any) => c.text)
              ?.join('\n') || '';
          return responseText;
        }

        return await response.text();
      }

      // Local direct-tool mode
      const result = await kendoReactAssistantTool({
        query,
        component: component as (typeof KENDO_COMPONENTS)[number]
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
    return this.isConnected;
  }

  getAvailableComponents(): string[] {
    return [...KENDO_COMPONENTS];
  }

  isValidComponent(component: string): boolean {
    return KENDO_COMPONENTS.includes(component as any);
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        console.log('🔌 Kendo MCP Client: Disconnected');
      } catch (error) {
        console.error('❌ Kendo MCP Client: Error disconnecting:', error);
      }
    }
    this.isConnected = false;
  }
}

export function getKendoMCPClient(): KendoMCPClient {
  return new KendoMCPClient();
}
