import { z } from 'zod';
import { Agent, run } from '@openai/agents';
import { ACTComponent, AgentResponse } from '../types';
import { ACT_TO_KENDO_MAPPINGS } from '../kendo-components';

import { getKendoMCPClient } from '../tools/kendo-mcp-client';

const kendoCodeSchema = z.object({
  components: z
    .object({
      imports: z
        .array(z.string())
        .describe(
          'Array of import statements required for the Kendo components. Each import should be a complete import statement like "import { Button } from \'@progress/kendo-react-buttons\';" or "import { DataGrid } from \'@progress/kendo-react-grid\';". Include all necessary imports for the components used in mainComponent.'
        ),
      mainComponent: z
        .string()
        .describe(
          'Complete React component code as a string. This should be a fully functional React component that uses Kendo UI components. Include proper JSX syntax, component structure, props, and realistic mock data. The component should be ready to use and demonstrate the Kendo components in action.'
        ),
      metadata: z
        .object({
          totalComponents: z
            .number()
            .describe(
              'Total count of Kendo UI components used in the mainComponent. Count each component instance (e.g., if you use 2 Button components, count as 2).'
            ),
          componentTypes: z
            .array(z.string())
            .describe(
              'Array of Kendo component type names used in the mainComponent. List the component names like ["Button", "DataGrid", "DropDownList"]. Each string should be the exact Kendo component name.'
            )
        })
        .describe(
          'Metadata about the generated components including counts and types used.'
        )
    })
    .describe(
      'The main components object containing all the generated React code and metadata.'
    )
});

export class MergerAgent {
  protected agent: Agent<{}, typeof kendoCodeSchema>;
  private kendoMCPClient: ReturnType<typeof getKendoMCPClient>;

  constructor() {
    this.kendoMCPClient = getKendoMCPClient();
    this.agent = new Agent<{}, typeof kendoCodeSchema>({
      name: 'merger-agent',
      instructions: `
      You are a merger agent that converts Abstract Component Trees (ACT) into Kendo UI React components with HTML elements where appropriate.

      Your role:
      1. Map ACT components to Kendo UI components or HTML elements
      2. Use MCP documentation to understand component requirements
      3. Generate complete React code with proper imports and realistic mock data

      Key Requirements:
      - Use Kendo components for complex UI (buttons, forms, data display)
      - Use HTML elements for basic content (links, images, text)
      - Include realistic mock data that matches component schemas
      - Generate production-ready, syntactically correct code
      - Follow React best practices and accessibility guidelines

      Mock Data Requirements:
      - Tables/Grids: Sample rows with realistic data in exact schema format
      - Forms: Pre-filled example values using documented field structure
      - Lists: Sample items with properties matching documented item schema
      - Charts: Sample datasets with data structure as specified in documentation
      - Navigation: Realistic menu items and breadcrumb paths
      - User profiles: Sample user information structured according to prop requirements
      - Notifications: Example messages and alerts in expected format

      The mainComponent should be complete, functional React components ready for use.
      `,
      model: 'gpt-5',
      modelSettings: {
        providerData: {
          reasoning: { effort: 'minimal' },
          text: { verbosity: 'low' }
        }
      },
      outputType: kendoCodeSchema
    });

    this.initializeEvents();
  }

  private extractKendoComponents(actStructure: ACTComponent): string[] {
    const components: string[] = [];

    const traverse = (component: ACTComponent) => {
      // Map ACT component names to Kendo React components using the existing mapping
      const actComponentName = component.component?.toLowerCase();
      if (actComponentName) {
        const kendoComponent = this.mapActToKendoComponent(actComponentName);
        if (!kendoComponent) {
          console.log(
            `⚠️ Merger Agent: No Kendo component found for ${actComponentName}, will use HTML element`
          );
        } else if (kendoComponent.startsWith('HTML_')) {
          console.log(
            `🔗 Merger Agent: Using HTML element for ${actComponentName}`
          );
          // Don't add HTML elements to the Kendo components list
        } else if (kendoComponent && !components.includes(kendoComponent)) {
          components.push(kendoComponent);
        }
      }

      // Traverse children
      if (component.children && Array.isArray(component.children)) {
        component.children.forEach((child: ACTComponent) => traverse(child));
      }
    };

    traverse(actStructure);
    return components;
  }

  private mapActToKendoComponent(actComponent: string): string | null {
    const mapping =
      ACT_TO_KENDO_MAPPINGS[actComponent as keyof typeof ACT_TO_KENDO_MAPPINGS];

    // Handle special React native components - these will use HTML elements
    if (mapping?.component === 'ReactLink') {
      return 'HTML_LINK'; // Special marker for HTML elements
    }

    // Handle HTML element fallbacks
    if (mapping?.component?.startsWith('HTML_')) {
      return mapping.component;
    }

    return mapping?.component || null;
  }

  private extractComponentDescriptions(
    actStructure: ACTComponent
  ): Record<string, string> {
    const descriptions: Record<string, string> = {};

    const traverse = (component: ACTComponent) => {
      const actComponentName = component.component?.toLowerCase();
      if (actComponentName) {
        const kendoComponent = this.mapActToKendoComponent(actComponentName);
        if (kendoComponent && !kendoComponent.startsWith('HTML_')) {
          // Use the MCP query from the ACT structure if available, otherwise fall back to description
          if (component.mcpQuery) {
            descriptions[kendoComponent] = component.mcpQuery;
          }
        }
      }

      // Traverse children
      if (component.children && Array.isArray(component.children)) {
        component.children.forEach((child: ACTComponent) => traverse(child));
      }
    };

    traverse(actStructure);
    return descriptions;
  }

  private async fetchComponentDocumentation(
    components: string[],
    mcpQueries: Record<string, string>
  ): Promise<Record<string, string>> {
    const docs: Record<string, string> = {};

    if (!this.kendoMCPClient.isReady()) {
      console.warn(
        '⚠️ Merger Agent: Kendo MCP client not ready, skipping documentation fetch'
      );
      return docs;
    }

    const docPromises = components.map(async (component) => {
      try {
        console.log(`📚 Merger Agent: Fetching docs for ${component}`);

        const componentQuery =
          mcpQueries[component] ||
          `Create a complete ${component} component implementation with full working code example, props, and realistic sample data`;

        const componentDocs = await this.kendoMCPClient.queryKendoComponent(
          componentQuery,
          component
        );

        // Store the raw MCP response directly as context
        docs[component] = componentDocs;
      } catch (error) {
        console.error(
          `❌ Merger Agent: Failed to fetch docs for ${component}:`,
          error
        );
      }
    });

    await Promise.all(docPromises);

    return docs;
  }

  async mergeToKendo(actStructure: ACTComponent): Promise<AgentResponse> {
    try {
      console.log('🔧 Merger Agent: Merging ACT to Kendo components');

      const requiredComponents = this.extractKendoComponents(
        actStructure.structure
      );
      console.log('🎯 Merger Agent: Required components:', requiredComponents);

      // Extract MCP queries from ACT structure
      const mcpQueries = this.extractComponentDescriptions(
        actStructure.structure
      );

      const componentDocs = await this.fetchComponentDocumentation(
        requiredComponents,
        mcpQueries
      );

      // Build context from raw MCP responses
      const docsContext = Object.entries(componentDocs)
        .map(([componentName, rawResponse]) => {
          return `## ${componentName} Documentation:\n${rawResponse}`;
        })
        .join('\n\n---\n\n');

      const result = await run(
        this.agent,
        `Convert the following ACT structure to Kendo UI React components with React native elements where appropriate:

        ACT Structure:
        ${JSON.stringify(actStructure, null, 2)}

        Required Kendo Components: ${requiredComponents.join(', ')}

        ${docsContext ? `\n\nComponent Documentation:\n${docsContext}\n\n` : ''}

        The MCP server has provided the most appropriate Kendo React components and their documentation above`
      );

      const kendoData = kendoCodeSchema.parse(result.finalOutput);
      console.log('✅ Merger Agent: Successfully parsed schema');

      return {
        success: true,
        data: {
          code: kendoData.components,
          originalACT: actStructure
        }
      };
    } catch (error) {
      console.error('❌ Merger Agent: Error merging to Kendo:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to merge ACT to Kendo components'
      };
    }
  }

  initializeEvents() {}

  cleanup(): void {
    if (this.kendoMCPClient) {
      this.kendoMCPClient.disconnect();
    }
  }
}
