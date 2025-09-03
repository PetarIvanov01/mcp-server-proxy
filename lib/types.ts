import { z } from 'zod';

// Abstract Component Tree (ACT) Schema
export const ACTComponentSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    component: z
      .string()
      .describe(
        'The basic unit that LLMs understand (e.g., container, header, button)'
      ),
    description: z
      .string()
      .describe('The reason for having this component and its purpose'),
    children: z
      .union([z.array(ACTComponentSchema), z.string()])
      .describe('Child components or text content (empty string if none)')
  })
);

export type ACTComponent = z.infer<typeof ACTComponentSchema>;

// Planning Schema
export const PlanStepSchema = z.object({
  id: z.string(),
  description: z.string(),
  agent: z.enum(['planner', 'structure', 'merger']),
  dependencies: z.array(z.string()),
  status: z
    .enum(['pending', 'in_progress', 'completed', 'failed'])
    .default('pending')
});

export const ExecutionPlanSchema = z.object({
  id: z.string(),
  userQuery: z.string(),
  steps: z.string().describe('Execution plan in markdown format'),
  createdAt: z.date().default(() => new Date()),
  status: z
    .enum(['pending', 'in_progress', 'completed', 'failed'])
    .default('pending')
});

export type PlanStep = z.infer<typeof PlanStepSchema>;
export type ExecutionPlan = z.infer<typeof ExecutionPlanSchema>;

// Kendo Component Mapping Schema
export const KendoComponentMappingSchema = z.object({
  actComponent: z.string(),
  kendoComponent: z.string(),
  description: z.string(),
  category: z.enum([
    'layout',
    'navigation',
    'input',
    'display',
    'data',
    'feedback'
  ])
});

export type KendoComponentMapping = z.infer<typeof KendoComponentMappingSchema>;

// Agent Response Schemas
export const AgentResponseSchema = z.object({
  success: z.boolean(),
  data: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({}),
    z.array(z.union([z.string(), z.number(), z.boolean(), z.object({})]))
  ]),
  error: z.string(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
});

export type AgentResponse = {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: Record<string, any>;
};

// User Query Schema
export const UserQuerySchema = z.object({
  query: z.string().min(1, 'Query cannot be empty'),
  context: z.string()
});

export type UserQuery = z.infer<typeof UserQuerySchema>;
