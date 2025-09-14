import { UserQuerySchema, AgentResponse } from '../types';
import { PlannerAgent } from './planner-agent';
import { StructureAgent } from './structure-agent';
import { MergerAgent } from './merger-agent';

class CoreAgent {
  private plannerAgent: PlannerAgent;
  private structureAgent: StructureAgent;
  private mergerAgent: MergerAgent;

  constructor() {
    this.plannerAgent = new PlannerAgent();
    this.structureAgent = new StructureAgent();
    this.mergerAgent = new MergerAgent();
  }

  async processUserQuery(userQuery: string): Promise<AgentResponse> {
    try {
      // Validate input
      const validatedQuery = UserQuerySchema.parse({
        query: userQuery,
        context: '',
        preferences: {}
      });

      const plan = await this.plannerAgent.createPlan(validatedQuery.query);

      if (!plan.success || !plan.data) {
        return {
          success: false,
          error: `Failed to create execution plan: ${plan.error}`
        };
      }

      const actResult = await this.structureAgent.generateACT(
        validatedQuery.query,
        plan.data
      );

      let actStructure = null;
      let actError = null;

      if (actResult.success) {
        actStructure = actResult.data;
      } else {
        console.error('❌ Core Agent: ACT generation failed:', actResult.error);
        actError = actResult.error;
      }

      // Step 3: Merge ACT to Kendo components (only if ACT was successful)
      let kendoComponents = null;
      let routePath = null;
      let kendoError = null;

      if (actStructure) {
        const kendoResult = await this.mergerAgent.mergeToKendo(actStructure);

        if (kendoResult.success) {
          kendoComponents = kendoResult.data;
          routePath = kendoResult.data.routePath;
        } else {
          console.error(
            '❌ Core Agent: Kendo merge failed:',
            kendoResult.error
          );
          kendoError = kendoResult.error;
        }
      }

      const hasErrors = actError || kendoError;
      const agentsUsed = ['planner'];
      if (actStructure) agentsUsed.push('structure');
      if (kendoComponents) agentsUsed.push('merger');

      return {
        success: !hasErrors, // Only fully successful if no errors
        data: {
          originalQuery: userQuery,
          executionPlan: plan.data,
          actStructure: actStructure,
          kendoComponents: kendoComponents,
          routePath: routePath,
          errors: {
            actError: actError,
            kendoError: kendoError
          },
          metadata: {
            processingTime: Date.now(),
            agentsUsed: agentsUsed,
            planMetadata: plan.metadata,
            partialSuccess: hasErrors // Indicates partial success
          }
        },
        error: hasErrors
          ? `Processing completed with errors. ACT: ${
              actError || 'OK'
            }, Kendo: ${kendoError || 'OK'}`
          : undefined
      };
    } catch (error) {
      console.error('❌ Core Agent: Error processing query:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

const coreAgent = new CoreAgent();

export default coreAgent;
