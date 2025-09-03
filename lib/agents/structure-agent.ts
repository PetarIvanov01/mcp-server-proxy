import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { ACTComponentSchema, AgentResponse, ExecutionPlan } from '../types';

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
      instructions: `
        You are a structure agent responsible for converting user queries into Abstract Component Trees (ACT).

        Your role is to:
        1. Analyze user requirements and break them down into logical components
        2. Create a hierarchical structure using common UI concepts
        3. Use intuitive component names that LLMs understand (container, header, button, etc.)
        4. Provide clear descriptions for each component's purpose
        5. Handle both simple and complex layouts with proper nesting

        Component Guidelines:
        - Use familiar concepts: container, header, footer, sidebar, main, section, article, aside
        - For navigation: nav, breadcrumb, tabs, pagination, stepper
        - For inputs: button, input, textarea, select, checkbox, radio, switch, slider
        - For display: text, heading, paragraph, image, badge, chip, avatar, progress, loader
        - For data: table, list, tree, chart, calendar, timeline
        - For feedback: dialog, modal, notification, alert, error, hint, tooltip

        Structure Rules:
        - Always start with a root container
        - Use semantic HTML-like structure
        - Provide meaningful descriptions for each component
        - Handle both nested components and leaf text nodes
        - Consider responsive design and accessibility

        The ACT should be a complete representation of the page structure that can be easily converted to actual UI components.`,
      model: 'gpt-4o-mini',
      outputType: actSchema
    });

    // Initialize event tracking
    this.initializeEvents();
  }

  /**
   * Generate ACT structure from user query and execution plan
   */
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

          Please create a complete ACT structure that represents the page layout. Consider:

          1. What is the main purpose of this page?
          2. What are the key sections/components needed?
          3. How should they be organized hierarchically?
          4. What are the relationships between components?
          5. Are there any interactive elements or data displays?

          Create a structure that:
          - Uses intuitive component names (container, header, button, etc.)
          - Provides clear descriptions for each component's purpose
          - Handles proper nesting and relationships
          - Includes all necessary components for the requested functionality
          - Is ready for conversion to actual UI components

          Return a complete ACT structure with metadata about the generated components.`
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

    // Note: Tool call events need to be identified from the available event types
    // The exact event names for tool tracking are not clear from the current SDK
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
