import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { AgentResponse } from '../types';
import { randomUUID } from 'crypto';

const planSchema = z.object({
  plan: z
    .string()
    .describe(
      'Structural plan in markdown format describing page layout, component hierarchy, and data requirements'
    )
});

export class PlannerAgent {
  protected agent: Agent<{}, typeof planSchema>;

  constructor() {
    this.agent = new Agent<{}, typeof planSchema>({
      name: 'planner-agent',
      instructions: `
      You are a planning agent responsible for creating execution plans for page generation tasks.

      Your role is to:
      1. Analyze user queries for page generation
      2. Identify the structural components needed
      3. Create a logical component hierarchy
      4. Define the page layout and organization
      5. Provide clear structural guidance in markdown format

      MANDATORY REQUIREMENTS:
      - MUST include at least 6 different component families (buttons, forms, data display, navigation, feedback, layout)
      - MUST include these standard sections: Header/Navigation, Main Content, Footer
      - MUST specify what data each section needs (user info, product data, navigation items, etc.)
      - MUST ensure component diversity for rich, professional pages

      You should create plans that focus on:
      - Page structure and layout
      - Component hierarchy and nesting
      - Data flow and component relationships
      - UI organization and sections
      - Component types and their purposes
      - Required data for each component

      The steps should be formatted as a markdown document with:
      - Clear headings for each structural section
      - Component lists and their purposes
      - Layout descriptions and organization
      - Data requirements for each component
      - Component relationships and dependencies

      Focus on structural aspects that help the LLM understand what components to create and how to organize them.`,
      model: 'gpt-5',
      outputType: planSchema,
      modelSettings: {
        providerData: {
          reasoning: { effort: 'minimal' },
          text: { verbosity: 'low' }
        }
      }
    });

    // Initialize event tracking
    this.initializeEvents();
  }

  async createPlan(userQuery: string): Promise<AgentResponse> {
    try {
      console.log('📋 Planner Agent: Creating plan for query:', userQuery);

      const result = await run(
        this.agent,
        `Create a structural plan for the following page generation request:

        "${userQuery}"
        `
      );

      console.log('🔧 Planner Agent: Result', result);

      this.logToolExecutionInfo(result);

      const planData = planSchema.parse(result.finalOutput);

      const validatedPlan = {
        id: randomUUID(),
        userQuery: userQuery,
        plan: planData.plan,
        createdAt: new Date()
      };

      return {
        success: true,
        data: validatedPlan,
        metadata: {
          format: 'markdown'
        }
      };
    } catch (error) {
      console.error('❌ Planner Agent: Error creating plan:', error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create execution plan'
      };
    }
  }

  initializeEvents() {
    this.agent.on('agent_start', (_, agent) => {
      console.log('📋 Planner Agent: Started', {
        agentName: agent.name,
        timestamp: new Date().toISOString()
      });
    });

    this.agent.on('agent_end', (_, output) => {
      console.log('✅ Planner Agent: Completed', {
        timestamp: new Date().toISOString(),
        outputLength: output?.length || 0
      });
    });

    this.agent.on('agent_tool_start', (_, event) => {
      console.log('🔧 Planner Agent: Tool started:', event);
    });

    this.agent.on('agent_tool_end', (_, event) => {
      console.log('🔧 Planner Agent: Tool ended:', event);
    });
  }

  private logToolExecutionInfo(result: any) {
    console.log('🔧 Planner Agent: Execution Info', {
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
