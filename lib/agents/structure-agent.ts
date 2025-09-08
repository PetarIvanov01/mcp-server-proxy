import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { ACTComponentSchema, AgentResponse, ExecutionPlan } from '../types';
import {
  ACT_ELEMENTS,
  ACT_ELEMENTS_FLAT,
  getKendoComponentForACT,
  getACTElementsByCategory,
  formatACTElementsForPrompt
} from '../kendo-components';

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
      model: 'gpt-4o-mini',
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

        Available ACT Components (use these semantic components for building your structure):
        
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

        The ACT should be a complete representation of the page structure that can be easily converted to actual UI components.`;
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

  // Helper method to get component suggestions based on context
  getComponentSuggestions(context: string): string[] {
    const suggestions: string[] = [];

    // Analyze context and suggest relevant components
    const contextLower = context.toLowerCase();

    // Layout suggestions
    if (contextLower.includes('page') || contextLower.includes('layout')) {
      suggestions.push('container', 'wrapper', 'main', 'content', 'section');
    }

    // Navigation suggestions
    if (
      contextLower.includes('nav') ||
      contextLower.includes('menu') ||
      contextLower.includes('breadcrumb')
    ) {
      suggestions.push(
        'navigation',
        'menu',
        'breadcrumb',
        'tabs',
        'pagination'
      );
    }

    // Form suggestions
    if (
      contextLower.includes('form') ||
      contextLower.includes('input') ||
      contextLower.includes('submit')
    ) {
      suggestions.push(
        'form',
        'input',
        'button',
        'submit',
        'field',
        'fieldset'
      );
    }

    // Data display suggestions
    if (
      contextLower.includes('table') ||
      contextLower.includes('list') ||
      contextLower.includes('data')
    ) {
      suggestions.push('table', 'grid', 'list', 'card', 'item');
    }

    // Chart suggestions
    if (
      contextLower.includes('chart') ||
      contextLower.includes('graph') ||
      contextLower.includes('visualization')
    ) {
      suggestions.push('chart', 'barchart', 'linechart', 'piechart', 'gauge');
    }

    // Media suggestions
    if (
      contextLower.includes('image') ||
      contextLower.includes('photo') ||
      contextLower.includes('video')
    ) {
      suggestions.push('image', 'avatar', 'gallery', 'carousel');
    }

    // Feedback suggestions
    if (
      contextLower.includes('alert') ||
      contextLower.includes('notification') ||
      contextLower.includes('error')
    ) {
      suggestions.push('alert', 'notification', 'error', 'warning', 'success');
    }

    return suggestions.slice(0, 10); // Return top 10 suggestions
  }

  // Helper method to validate ACT component against available elements
  validateACTComponent(component: string): boolean {
    return ACT_ELEMENTS_FLAT.includes(component as any);
  }

  // Helper method to get Kendo mapping for an ACT component
  getKendoMapping(actComponent: string) {
    return getKendoComponentForACT(actComponent);
  }

  // Helper method to get components by category
  getComponentsByCategory(
    category:
      | 'layout'
      | 'navigation'
      | 'input'
      | 'display'
      | 'data'
      | 'charts'
      | 'feedback'
  ): string[] {
    return getACTElementsByCategory(category);
  }
}
