import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { ACTComponent, AgentResponse } from '../types';
import {
  KENDO_COMPONENTS,
  COMPONENT_CATEGORIES,
  ACT_TO_KENDO_MAPPINGS
} from '../kendo-components';
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

  constructor() {
    this.agent = new Agent<{}, typeof kendoCodeSchema>({
      name: 'merger-agent',
      instructions: `
      You are a merger agent responsible for converting Abstract Component Trees (ACT) into Kendo UI React components.

      Your role is to:
      1. Map ACT components to appropriate Kendo UI components
      2. Use kendo_docs_crawler to fetch the latest documentation for each component
      3. Generate complete React component code with proper imports
      4. Always include realistic mock data within the component code
      5. Handle component props, styling, and configuration
      6. Ensure proper component composition and nesting
      7. Generate production-ready, syntactically correct code

      Available Kendo Components:
      ${KENDO_COMPONENTS.join(', ')}

      Component Categories:
      ${Object.entries(COMPONENT_CATEGORIES)
        .map(
          ([category, components]) => `${category}: ${components.join(', ')}`
        )
        .join('\n')}

      Common ACT to Kendo Mappings with Documentation URLs:
      ${Object.entries(ACT_TO_KENDO_MAPPINGS)
        .map(
          ([act, mapping]) =>
            `${act} → ${mapping.component} (${mapping.docsUrl})`
        )
        .join('\n')}

      - Component props and their types
      - Usage examples and best practices
      - Import statements and package names
      - Styling and theming options
      - Component-specific configuration

      MOCK DATA REQUIREMENT: Always generate realistic mock data within your component code. The mock data format MUST match the exact structure expected by each Kendo UI component as documented in their official documentation. This includes:
      - Sample data for tables, lists, and grids (matching the component's data schema)
      - Mock user information for forms and profiles (following the component's prop structure)
      - Example content for text, images, and media (using the component's expected format)
      - Sample navigation items and menu options (matching the component's data structure)
      - Realistic dates, numbers, and text content (in the format the component expects)
      - Mock API responses or state data (structured according to component documentation)
      - Example user interactions and events (following the component's event handling patterns)

      Code Generation Guidelines:
      - Use kendo_docs_crawler to get the latest documentation for the components
      - Use proper React/TypeScript syntax
      - Include necessary imports from @progress/kendo-react-*
      - ALWAYS include realistic mock data within the component code
      - Handle component props appropriately based on documentation
      - Use proper Kendo UI theming and component properties
      - Ensure proper component composition
      - Add proper TypeScript types where needed
      - Follow React best practices
      - Generate clean, readable, and maintainable code
      - Make components immediately usable with sample data

      The mainComponent should be complete, functional React components that can be directly used in a Kendo UI application.

      CRITICAL: Your response MUST strictly adhere to the defined schema structure. Return ONLY a valid JSON object with the exact structure:
      {
        "components": {
          "imports": ["import statements"],
          "mainComponent": "complete React component code as string",
          "metadata": {
            "totalComponents": number,
            "componentTypes": ["array of component names"]
          }
        }
      }`,
      model: 'gpt-4o-mini',
      outputType: kendoCodeSchema
    });

    // Initialize event tracking
    this.initializeEvents();
  }

  async mergeToKendo(actStructure: ACTComponent): Promise<AgentResponse> {
    try {
      console.log('🔧 Merger Agent: Merging ACT to Kendo components');

      const result = await run(
        this.agent,
        `Convert the following ACT structure to Kendo UI React components:

        ${JSON.stringify(actStructure, null, 2)}

        First, identify which Kendo components you need from the ACT structure, then use the kendo_docs_crawler tool with the appropriate URLs from the mappings below:

        Available Kendo Component Mappings with Documentation URLs:
        ${JSON.stringify(ACT_TO_KENDO_MAPPINGS, null, 2)}

        For example, if you need to use a DataGrid component, you MUST call:
        kendo_docs_crawler({
          urls: ["https://www.telerik.com/kendo-react-ui/components/grid/"],
          componentNames: ["DataGrid"]
        })

        Pay special attention to:
        - The exact data structure and schema each component expects
        - Required and optional props for each component
        - Event handling patterns and callback signatures
        - Data formatting requirements (dates, numbers, strings, etc.)
        - Component-specific configuration options

        Generate complete, production-ready React code that:

        1. Uses kendo_docs_crawler to get the latest documentation for each component
        2. Uses appropriate Kendo UI components for each ACT component
        3. Includes all necessary imports from @progress/kendo-react-*
        4. ALWAYS includes realistic mock data within the component code
        5. Handles component props, styling, and configuration properly based on documentation
        6. Follows React and TypeScript best practices
        7. Is syntactically correct and ready to use
        8. Includes proper component composition and nesting
        9. Uses appropriate styling approaches (CSS classes, Kendo themes, etc.)
        10. Makes components immediately usable with sample data

        Process (MUST follow these steps in order):
        1. First, identify which Kendo components you need to use from the ACT structure
        2. FOR EACH COMPONENT: Use the kendo_docs_crawler to fetch documentation (this is MANDATORY)
        3. From the documentation, identify the exact data structure and prop format each component expects
        4. Create realistic mock data that matches the component's documented data schema exactly
        5. Based on the documentation, generate the appropriate code with properly formatted mock data
        6. Ensure all imports, props, and styling are correct according to the documentation
        7. Verify that components are immediately usable with the provided mock data

        Consider:
        - Which Kendo components best match each ACT component
        - How to handle component props and configuration (from documentation)
        - Proper styling and theming (from documentation)
        - Component relationships and nesting
        - TypeScript types and interfaces
        - Code organization and readability
        - Mock data examples (format must match component documentation):
          * Tables/Grids: Sample rows with realistic data in the exact schema format documented for the component
          * Forms: Pre-filled example values using the component's documented field structure and validation rules
          * Lists: Sample items with properties that match the component's documented item schema
          * Charts: Sample datasets with data structure exactly as specified in the component documentation
          * Navigation: Realistic menu items and breadcrumb paths using the component's documented data format
          * User profiles: Sample user information structured according to the component's prop requirements
          * Notifications: Example messages and alerts in the format expected by the component

        Return complete React component code with imports and main component.

        CRITICAL: Your response MUST be a valid JSON object with this EXACT structure:
        {
          "components": {
            "imports": [
              "import { Button } from '@progress/kendo-react-buttons';",
              "import { DataGrid } from '@progress/kendo-react-grid';"
            ],
            "mainComponent": "const MyComponent = () => { return (<div><Button>Click me</Button></div>); }; export default MyComponent;",
            "metadata": {
              "totalComponents": 2,
              "componentTypes": ["Button", "DataGrid"]
            }
          }
        }

        REQUIREMENTS:
        - imports: Array of complete import statements for all Kendo components used
        - mainComponent: Complete React component code as a string (not an object)
        - metadata.totalComponents: Count of all component instances used
        - metadata.componentTypes: Array of component type names used

        EXAMPLE RESPONSE:
        {
          "components": {
            "imports": [
              "import { DropDownList } from '@progress/kendo-react-dropdowns';",
              "import { Button } from '@progress/kendo-react-buttons';"
            ],
            "mainComponent": "const FoodOrderComponent = () => { const categories = ['Pizza', 'Burger', 'Pasta']; return (<div><h4>Choose food category</h4><DropDownList data={categories} defaultValue='Pizza' style={{width: '300px'}} /><Button>Order Now</Button></div>); }; export default FoodOrderComponent;",
            "metadata": {
              "totalComponents": 2,
              "componentTypes": ["DropDownList", "Button"]
            }
          }
        }

        Do not include any text, explanations, or code outside of this JSON structure.`
      );

      // Debug: Log what the agent actually returned
      console.log('🔍 Merger Agent: Raw finalOutput:', result.finalOutput);

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
}
