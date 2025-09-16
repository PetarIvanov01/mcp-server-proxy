import { NextRequest, NextResponse } from 'next/server';
import { UserQuerySchema } from '@/lib/types';
import coreAgent from '@/lib/agents/core-agent';

export const maxDuration = 60 * 15; // 15 seconds
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedBody = UserQuerySchema.parse({
      query: body.query || '',
      context: body.context || ''
    });

    const result = await coreAgent.processUserQuery(validatedBody.query);

    if (!result.success && !result.data) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: result.success,
      data: result.data,
      error: result.error,
      metadata: {
        ...result.metadata,
        timestamp: new Date().toISOString(),
        processingTime: Date.now()
      }
    });
  } catch (error) {
    console.error('❌ API: Error processing request:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
