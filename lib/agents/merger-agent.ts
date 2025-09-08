import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { ACTComponent, AgentResponse } from '../types';
import { ACT_TO_KENDO_MAPPINGS } from '../kendo-components';

import { getKendoMCPClient } from '../tools/kendo-mcp-client';
import {
  extractKendoComponentInfo,
  KendoComponentInfo
} from '../utils/kendo-extraction';

import * as fs from 'fs';
import * as path from 'path';

const mcpOutputDir = path.join(process.cwd(), '.mcp-outputs');
if (!fs.existsSync(mcpOutputDir)) {
  fs.mkdirSync(mcpOutputDir, { recursive: true });
}

const sessionDir = path.join(
  mcpOutputDir,
  `session-${new Date().toISOString().replace(/[:.]/g, '-')}`
);

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
      You are a merger agent responsible for converting Abstract Component Trees (ACT) into Kendo UI React components with React native elements where appropriate.

      Your role is to:
      1. Map ACT components to appropriate Kendo UI components OR React native/HTML elements
      2. Use the provided Kendo MCP documentation to understand component requirements
      3. Generate complete React component code with proper imports
      4. Always include realistic mock data within the component code
      5. Handle component props, styling, and configuration
      6. Ensure proper component composition and nesting
      7. Generate production-ready, syntactically correct code
      8. Use React native elements (like <a>, <img>) for basic content and Kendo components for complex UI

      ENHANCED CAPABILITIES:
      - You now have access to real-time Kendo UI React component documentation via the MCP client
      - Component documentation is automatically fetched and provided in your context
      - Structured prop information is extracted and provided for better code generation
      - This ensures you have the most up-to-date information about component APIs, props, and usage patterns

      The MCP server will provide you with the most appropriate Kendo React components and their documentation based on the ACT component types you need to implement.

      - Component props and their types (with structured extraction)
      - Usage examples and best practices
      - Import statements and package names
      - Styling and theming options
      - Component-specific configuration
      - Structured prop details including names, types, summaries, and package information

      MOCK DATA REQUIREMENT: Always generate realistic mock data within your component code. The mock data format MUST match the exact structure expected by each Kendo UI component as documented in their official documentation. This includes:
      - Sample data for tables, lists, and grids (matching the component's data schema)
      - Mock user information for forms and profiles (following the component's prop structure)
      - Example content for text, images, and media (using the component's expected format)
      - Sample navigation items and menu options (matching the component's data structure)
      - Realistic dates, numbers, and text content (in the format the component expects)
      - Mock API responses or state data (structured according to component documentation)
      - Example user interactions and events (following the component's event handling patterns)

      Code Generation Guidelines:
      - Use the provided Kendo MCP documentation to understand component requirements
      - Use proper React/TypeScript syntax
      - Include necessary imports from @progress/kendo-react-* for Kendo components
      - Use React native elements (<a>, <img>, <div>, <span>) for basic content
      - ALWAYS include realistic mock data within the component code
      - Handle component props appropriately based on the MCP documentation
      - Use proper Kendo UI theming and component properties
      - Ensure proper component composition and semantic HTML structure
      - Add proper TypeScript types where needed
      - Follow React best practices and accessibility guidelines
      - Generate clean, readable, and maintainable code
      - Make components immediately usable with sample data
      - Use appropriate HTML elements for links, images, and basic content

      The mainComponent should be complete, functional React components that can be directly used in a Kendo UI application.
      `,
      model: 'gpt-4o-mini',
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
            `❌ Merger Agent: No Kendo component found for ${actComponentName}`
          );
        }
        if (kendoComponent && !components.includes(kendoComponent)) {
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

    // Handle special React native components
    if (mapping?.component === 'ReactLink') {
      return null;
    }

    return mapping?.component || null;
  }

  private async fetchComponentDocumentation(
    components: string[]
  ): Promise<Record<string, KendoComponentInfo>> {
    const docs: Record<string, KendoComponentInfo> = {};

    if (!this.kendoMCPClient.isReady()) {
      console.warn(
        '⚠️ Merger Agent: Kendo MCP client not ready, skipping documentation fetch'
      );
      return docs;
    }

    const docPromises = components.map(async (component) => {
      try {
        console.log(`📚 Merger Agent: Fetching docs for ${component}`);

        const query = `Create a complete ${component} component implementation with:
        - Full working code example with imports
        - All available props and their types
        - Realistic sample data
        - Event handlers and callbacks
        - Styling and theming options
        - Best practices and common patterns
        - Multiple usage examples if applicable
        `;

        const componentDocs = await this.kendoMCPClient.queryKendoComponent(
          query,
          component
        );

        // Extract structured information using the new extraction function
        const extractedInfo = extractKendoComponentInfo(
          component,
          componentDocs
        );
        docs[component] = extractedInfo;

        if (process.env?.DEBUG === 'true') {
          printToFile(sessionDir, `${component}-raw-response.json`, {
            component,
            query,
            timestamp: new Date().toISOString(),
            rawResponse: componentDocs,
            extractedInfo: extractedInfo
          });
        }
      } catch (error) {
        console.error(
          `❌ Merger Agent: Failed to fetch docs for ${component}:`,
          error
        );
      }
    });

    await Promise.all(docPromises);

    if (process.env?.DEBUG === 'true') {
      printToFile(sessionDir, 'session-summary.json', {
        timestamp: new Date().toISOString(),
        components: components,
        totalComponents: components.length,
        extractedDocs: Object.entries(docs).map(([name, info]) => ({
          componentName: name,
          importsCount: info.imports.length,
          examplesCount: info.examples.length,
          propsCount: Object.keys(info.props).length
        }))
      });
    }

    return docs;
  }

  async mergeToKendo(actStructure: ACTComponent): Promise<AgentResponse> {
    try {
      console.log('🔧 Merger Agent: Merging ACT to Kendo components');

      const requiredComponents = this.extractKendoComponents(
        actStructure.structure
      );
      console.log('🎯 Merger Agent: Required components:', requiredComponents);

      const componentDocs = await this.fetchComponentDocumentation(
        requiredComponents
      );

      console.log(
        '📖 Merger Agent: Fetched docs for components:',
        Object.keys(componentDocs)
      );

      // Build structured context from extracted component information
      const docsContext = Object.entries(componentDocs)
        .map(([componentName, info]) => {
          const importsSection =
            info.imports.length > 0
              ? `\n### Imports:\n${info.imports.join('\n')}`
              : '';

          const examplesSection =
            info.examples.length > 0
              ? `\n### Examples:\n${info.examples
                  .map(
                    (ex) => `#### ${ex.title}:\n\`\`\`tsx\n${ex.code}\n\`\`\``
                  )
                  .join('\n\n')}`
              : '';

          const propsSection =
            Object.keys(info.props).length > 0
              ? `\n### Props:\n${Object.entries(info.props)
                  .map(
                    ([propName, propDetails]) =>
                      `- **${propName}**: ${propDetails.syntax.return.type} - ${propDetails.summary}`
                  )
                  .join('\n')}`
              : '';

          return `## ${componentName} Documentation:${importsSection}${examplesSection}${propsSection}`;
        })
        .join('\n\n---\n\n');

      const result = await run(
        this.agent,
        `Convert the following ACT structure to Kendo UI React components with React native elements where appropriate:

        ACT Structure:
        ${JSON.stringify(actStructure, null, 2)}

        Required Kendo Components: ${requiredComponents.join(', ')}

        ${docsContext ? `\n\nComponent Documentation:\n${docsContext}\n\n` : ''}

        The MCP server has provided the most appropriate Kendo React components and their documentation above.

        CRITICAL COMPONENT USAGE PATTERNS:
        
        KENDO REACT COMPONENTS:
        - Typography: Use <Typography.h1>, <Typography.h2>, <Typography.h3>, etc. for headings
        - Use <Typography.p> for paragraphs, <Typography.code> for inline code, <Typography.pre> for code blocks
        - DO NOT use variant props like variant='h5' - this is Material-UI syntax, not Kendo React
        - Use proper Kendo component names and props exactly as documented
        - Import from correct Kendo packages (@progress/kendo-react-*)
        
        REACT NATIVE COMPONENTS:
        - Links: Use <a> tags with proper href, target, and styling attributes
        - Images: Use <img> tags with proper src, alt, and styling attributes
        - Basic HTML elements: Use standard HTML elements like <div>, <span>, <section> when appropriate
        - For navigation links, use semantic HTML with proper accessibility attributes
        
        COMPONENT SELECTION RULES:
        - Use Kendo components for complex UI elements (buttons, forms, data display, navigation)
        - Use React native/HTML elements for basic content (links, images, text containers)
        - Always prioritize user experience and semantic HTML structure
        - Ensure proper accessibility attributes (alt text, aria labels, etc.)

        Process (MUST follow these steps in order):
        1. First, identify which Kendo components you need to use from the ACT structure
        2. Use the provided component documentation to understand each component's requirements
        3. Review the structured prop information to understand exact prop types and requirements
        4. From the documentation, identify the exact data structure and prop format each component expects
        5. Create realistic mock data that matches the component's documented data schema exactly
        6. Based on the documentation and structured props, generate the appropriate code with properly formatted mock data
        7. Ensure all imports, props, and styling are correct according to the documentation and structured prop information
        8. Verify that components are immediately usable with the provided mock data

        Consider:
        - Which Kendo components best match each ACT component
        - How to handle component props and configuration (from documentation and structured props)
        - Proper styling and theming (from documentation)
        - Component relationships and nesting
        - TypeScript types and interfaces (use structured prop type information)
        - Code organization and readability
        - Structured prop information for accurate prop usage and type safety
        - Mock data examples (format must match component documentation):
          * Tables/Grids: Sample rows with realistic data in the exact schema format documented for the component
          * Forms: Pre-filled example values using the component's documented field structure and validation rules
          * Lists: Sample items with properties that match the component's documented item schema
          * Charts: Sample datasets with data structure exactly as specified in the component documentation
          * Navigation: Realistic menu items and breadcrumb paths using the component's documented data format
          * User profiles: Sample user information structured according to the component's prop requirements
          * Notifications: Example messages and alerts in the format expected by the component
        `
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

function printToFile(dir: string, filename: string, meta: Record<string, any>) {
  fs.mkdirSync(dir, { recursive: true });
  const rawResponseFile = path.join(dir, filename);
  fs.writeFileSync(
    rawResponseFile,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        ...meta
      },
      null,
      2
    )
  );
}
