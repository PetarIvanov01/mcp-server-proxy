import { Agent, ModelSettings, run } from '@openai/agents';
import { z } from 'zod';
import { ACTComponentSchema, AgentResponse, ExecutionPlan } from '../types';
import { formatACTElementsForPrompt } from '../kendo-components';

const actSchema = z.object({
  act: z.object({
    root: ACTComponentSchema.describe(
      'The root component of the ACT structure'
    ),
    metadata: z.object({
      totalComponents: z
        .number()
        .describe('Total number of components in the structure'),
      maxDepth: z.number().describe('Maximum nesting depth'),
      componentTypes: z
        .array(z.string())
        .describe('List of unique component types used'),
      description: z
        .string()
        .describe('Overall description of the generated structure')
    })
  })
});

export class StructureAgent {
  protected agent: Agent<{}, typeof actSchema>;

  constructor() {
    this.agent = new Agent<{}, typeof actSchema>({
      name: 'structure-agent',
      instructions: this.buildInstructions(),
      model: 'gpt-5',
      modelSettings: {
        providerData: {
          reasoning: { effort: 'minimal' },
          text: { verbosity: 'low' }
        }
      },
      outputType: actSchema
    });

    this.initializeEvents();
  }

  private buildInstructions(): string {
    return `
        You are a structure agent responsible for converting user queries into Abstract Component Trees (ACT).

        Your role is to:
        1. Analyze user requirements and break them down into logical components
        2. Create a hierarchical structure using common UI concepts
        3. Use intuitive component names that LLMs understand (container, header, button, etc.)
        4. Provide clear descriptions for each component's purpose
        5. Handle both simple and complex layouts with proper nesting
        6. ENSURE component diversity across 6+ different families
        7. Include specific data requirements in component descriptions
        8. CREATE RICH, COMPREHENSIVE PAGE STRUCTURES with multiple components
        9. Focus on creating comprehensive component descriptions for better MCP integration

        Available ACT Components:
        
        ${formatACTElementsForPrompt()}

        Structure Rules:
        - Always start with a root container
        - Use semantic HTML-like structure
        - Provide meaningful descriptions for each component's purpose
        - Handle both nested components and leaf text nodes
        - Consider responsive design and accessibility
        - Choose components from the available list above
        - Use the most appropriate component for each use case
        - Consider the semantic meaning and purpose of each component
        - MANDATORY: Include components from at least 6 different families (Layout, Content, Interactive, Forms, Data Display, Media, etc.)
        - Include specific data requirements in descriptions (e.g., "user profile data", "product list", "navigation items")
        - Ensure rich, diverse component selection for professional pages
        ENRICHMENT REQUIREMENTS:
        - Create COMPREHENSIVE page structures with 6+ components minimum
        - Include multiple instances of the same component type where appropriate (e.g., multiple buttons, cards, or form fields)
        - Add supporting components like headers, footers, sidebars, and navigation elements
        - Include interactive elements like modals, dropdowns, and tooltips
        - Add data visualization components (charts, tables, lists) when relevant
        - Include form components for user input and interaction
        - Add media components for images, videos, or other content
        - Create realistic, production-ready page structures that feel complete
        - Think beyond basic layouts - include advanced UI patterns and interactions
        - Consider user experience flows and include all necessary UI elements
        - Add contextual components that enhance the overall page functionality

        The ACT should be a complete, rich representation of the page structure that can be easily converted to actual UI components.

        STYLING AND LAYOUTING REQUIREMENTS:
        - For each component, include a styleInfo field with appropriate Tailwind CSS classes (or null if no styling needed)
        - Use semantic and meaningful class combinations that reflect the component's purpose
        - Include responsive classes where appropriate (sm:, md:, lg:, xl:)
        - Consider layout properties like flex, grid, positioning, spacing, and sizing
        - Use color schemes, typography, and visual hierarchy that make sense for the component
        - Examples of good styleInfo values:
          * Header: "bg-gray-900 text-white p-4 shadow-lg"
          * Button: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          * Card: "bg-white rounded-lg shadow-md p-6 border border-gray-200"
          * Container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          * Flex container: "flex items-center justify-between gap-4"
          * Grid layout: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          * No styling needed: null

        MCP QUERY GENERATION REQUIREMENTS:
        - For each component that will be mapped to a Kendo component, generate a specific mcpQuery field
        - The mcpQuery should be a detailed request for component examples and documentation
        - Include the component's specific use case, styling requirements, and interaction needs
        - Ask for examples that match the component's role in the overall page structure
        - Be specific about what you want to see (props, styling, examples, usage patterns)
        - Consider the execution plan context when generating queries
        - Make queries actionable and targeted to get the most relevant documentation

        Example MCP Query Format:
        "Show me [ComponentName] examples for [specific use case] with [styling/interaction requirements]. Include [specific features needed] and [context about usage]."

        The mcpQuery field should only be included for components that will be mapped to actual Kendo UI components, not for generic containers or layout elements.`;
  }

  async generateACT(
    userQuery: string,
    executionPlan: ExecutionPlan
  ): Promise<AgentResponse> {
    try {
      console.log('🏗️ Structure Agent: Generating ACT for query:', userQuery);

      const result = await run(
        this.agent,
        `Generate an Abstract Component Tree (ACT) for the following page generation request:

        "${userQuery}"

        Execution Plan Context:
        ${JSON.stringify(executionPlan, null, 2)}

        CRITICAL REQUIREMENTS:
        - Include components from at least 6 different families (Layout, Content, Interactive, Forms, Data Display, Media, etc.)
        - Include specific data requirements in component descriptions (e.g., "user profile data", "product list", "navigation items")
        - Ensure rich, diverse component selection for professional pages
        - Follow the execution plan's component diversity requirements
        `
      );

      // Log tool execution information from the result
      this.logToolExecutionInfo(result);

      const actData = actSchema.parse(result.finalOutput || '{}');

      const validatedACT = ACTComponentSchema.parse(actData.act.root);

      return {
        success: true,
        data: {
          structure: validatedACT,
          metadata: actData.act.metadata
        }
      };
    } catch (error) {
      console.error('❌ Structure Agent: Error generating ACT:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate ACT structure'
      };
    }
  }

  initializeEvents() {
    this.agent.on('agent_start', (ctx, agent) => {
      console.log('🏗️ Structure Agent: Started', {
        agentName: agent.name,
        timestamp: new Date().toISOString()
      });
    });

    this.agent.on('agent_end', (ctx, output) => {
      console.log('✅ Structure Agent: Completed', {
        timestamp: new Date().toISOString(),
        outputLength: output?.length || 0
      });
    });

    this.agent.on('agent_tool_start', (ctx, event) => {
      console.log('🔧 Structure Agent: Tool started:', event);
    });

    this.agent.on('agent_tool_end', (ctx, event) => {
      console.log('🔧 Structure Agent: Tool ended:', event);
    });
  }

  private logToolExecutionInfo(result: any) {
    console.log('🔧 Structure Agent: Execution Info', {
      timestamp: new Date().toISOString(),
      hasFinalOutput: !!result.finalOutput,
      outputLength: result.finalOutput?.length || 0,
      // Log any tool-related information from the result
      toolCalls: result.toolCalls || [],
      toolResults: result.toolResults || [],
      // Log any other execution metadata
      executionTime: result.executionTime,
      tokensUsed: result.tokensUsed,
      // Log the full result structure for debugging
      resultKeys: Object.keys(result)
    });
  }
}
