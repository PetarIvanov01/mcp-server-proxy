import { NextRequest, NextResponse } from 'next/server';
import { UserQuerySchema } from '@/lib/types';
import coreAgent from '@/lib/agents/core-agent';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const fs = require('fs');
    const possiblePaths = [
      './node_modules',
      '../node_modules',
      '../../node_modules',
      '/var/task/node_modules',
      process.cwd() + '/node_modules'
    ];

    possiblePaths.forEach((path) => {
      try {
        if (fs.existsSync(path)) {
          console.log(`Found node_modules at: ${path}`);
        }
      } catch (e) {
        console.log(`Cannot access ${path}`);
      }
    });

    // Execute ls command to show directories in node_modules
    try {
      const { stdout, stderr } = await execAsync(
        'ls -la node_modules/ | grep "^d"'
      );

      const { stdout: stdoutProgress, stderr: stderrProgress } =
        await execAsync('ls node_modules/@progress/');

      console.log('Directories in node_modules:');
      console.log(stdout);
      console.log('Directories in node_modules/@progress:');
      console.log(stdoutProgress);
      if (stderr) {
        console.log('LS command stderr:', stderr);
      }
      if (stderrProgress) {
        console.log('LS command stderr:', stderrProgress);
      }
    } catch (error) {
      console.error('Error executing ls command:', error);
    }

    throw new Error('test');
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
