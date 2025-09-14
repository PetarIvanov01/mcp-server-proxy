import * as fs from 'fs';
import * as path from 'path';
import coreAgent from '../lib/agents/core-agent';

interface TestQuery {
  title: string;
  query: string;
}

interface TestResult {
  title: string;
  query: string;
  success: boolean;
  error?: string;
  executionTime: number;
  timestamp: string;
  results: {
    planner?: any;
    structure?: any;
    merger?: any;
    mcpQueries?: Record<string, string>;
    mcpResponses?: Record<string, string>;
  };
}

class GenerationTestRunner {
  private coreAgent: typeof coreAgent;
  private testDir: string;
  private resultsDir: string;

  constructor() {
    this.coreAgent = coreAgent;
    this.testDir = path.join(process.cwd(), '.generation-tests');
    this.resultsDir = path.join(this.testDir, 'results');

    // Create directories if they don't exist
    this.ensureDirectories();
  }

  private ensureDirectories() {
    if (!fs.existsSync(this.testDir)) {
      fs.mkdirSync(this.testDir, { recursive: true });
    }
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true });
    }
  }

  private async loadTestQueries(): Promise<TestQuery[]> {
    const queriesPath = path.join(process.cwd(), 'test-queries.json');
    const queriesData = fs.readFileSync(queriesPath, 'utf-8');
    return JSON.parse(queriesData);
  }

  private async runSingleTest(testQuery: TestQuery): Promise<TestResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    console.log(`\n🧪 Running test: ${testQuery.title}`);
    console.log(`📝 Query: ${testQuery.query.substring(0, 100)}...`);

    try {
      // Run the full generation pipeline
      const result = await this.coreAgent.processUserQuery(testQuery.query);

      const executionTime = Date.now() - startTime;

      if (result.success) {
        console.log(`✅ Test completed successfully in ${executionTime}ms`);
      } else {
        console.log(`❌ Test failed: ${result.error}`);
      }

      // Extract results from the core agent
      const testResult: TestResult = {
        title: testQuery.title,
        query: testQuery.query,
        success: result.success,
        error: result.error,
        executionTime,
        timestamp,
        results: {
          planner: result.data?.executionPlan,
          structure: result.data?.actStructure,
          merger: result.data?.kendoComponents,
          mcpQueries: result.data?.mcpQueries,
          mcpResponses: result.data?.mcpResponses
        }
      };

      return testResult;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.log(
        `💥 Test crashed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );

      return {
        title: testQuery.title,
        query: testQuery.query,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
        timestamp,
        results: {}
      };
    }
  }

  private async saveTestResult(testResult: TestResult) {
    const testId = testResult.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const testDir = path.join(this.resultsDir, testId);

    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }

    // Save individual result files
    if (testResult.results.planner) {
      fs.writeFileSync(
        path.join(testDir, 'planner-result.json'),
        JSON.stringify(testResult.results.planner, null, 2)
      );
    }

    if (testResult.results.structure) {
      fs.writeFileSync(
        path.join(testDir, 'structure-result.json'),
        JSON.stringify(testResult.results.structure, null, 2)
      );
    }

    if (testResult.results.merger) {
      fs.writeFileSync(
        path.join(testDir, 'merger-result.json'),
        JSON.stringify(testResult.results.merger, null, 2)
      );
    }

    if (testResult.results.mcpQueries) {
      fs.writeFileSync(
        path.join(testDir, 'mcp-queries.json'),
        JSON.stringify(testResult.results.mcpQueries, null, 2)
      );
    }

    if (testResult.results.mcpResponses) {
      fs.writeFileSync(
        path.join(testDir, 'mcp-responses.json'),
        JSON.stringify(testResult.results.mcpResponses, null, 2)
      );
    }

    // Save complete test result
    fs.writeFileSync(
      path.join(testDir, 'test-result.json'),
      JSON.stringify(testResult, null, 2)
    );

    console.log(`💾 Test results saved to: ${testDir}`);
  }

  private async saveSummaryReport(allResults: TestResult[]) {
    const summary = {
      timestamp: new Date().toISOString(),
      totalTests: allResults.length,
      successfulTests: allResults.filter((r) => r.success).length,
      failedTests: allResults.filter((r) => !r.success).length,
      averageExecutionTime:
        allResults.reduce((sum, r) => sum + r.executionTime, 0) /
        allResults.length,
      results: allResults.map((r) => ({
        title: r.title,
        success: r.success,
        executionTime: r.executionTime,
        error: r.error
      }))
    };

    fs.writeFileSync(
      path.join(this.testDir, 'test-summary.json'),
      JSON.stringify(summary, null, 2)
    );

    console.log(
      `📊 Summary report saved to: ${path.join(
        this.testDir,
        'test-summary.json'
      )}`
    );
  }

  async runAllTests() {
    console.log('🚀 Starting Generation Tests');
    console.log(`📁 Results will be saved to: ${this.testDir}`);

    try {
      const testQueries = await this.loadTestQueries();
      console.log(`📋 Loaded ${testQueries.length} test queries`);

      const allResults: TestResult[] = [];

      for (let i = 0; i < testQueries.length; i++) {
        const testQuery = testQueries[i];
        console.log(
          `\n📝 Test ${i + 1}/${testQueries.length}: ${testQuery.title}`
        );

        const result = await this.runSingleTest(testQuery);
        allResults.push(result);

        // Save individual test result
        await this.saveTestResult(result);

        // Add delay between tests to avoid rate limiting
        if (i < testQueries.length - 1) {
          console.log('⏳ Waiting 2 seconds before next test...');
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      // Save summary report
      await this.saveSummaryReport(allResults);

      // Print final summary
      console.log('\n🎯 Test Execution Complete!');
      console.log(
        `✅ Successful: ${allResults.filter((r) => r.success).length}`
      );
      console.log(`❌ Failed: ${allResults.filter((r) => !r.success).length}`);
      console.log(
        `⏱️  Average execution time: ${Math.round(
          allResults.reduce((sum, r) => sum + r.executionTime, 0) /
            allResults.length
        )}ms`
      );
    } catch (error) {
      console.error('💥 Test runner failed:', error);
      process.exit(1);
    }
  }
}

// Run the tests if this script is executed directly
if (require.main === module) {
  const runner = new GenerationTestRunner();
  runner.runAllTests().catch(console.error);
}

export { GenerationTestRunner };
