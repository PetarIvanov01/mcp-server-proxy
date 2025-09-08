import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });

import { MergerAgent } from '../lib/agents/merger-agent';
import { ACTComponent } from '../lib/types';
import * as fs from 'fs';
import * as path from 'path';

console.log('🚀 Testing Merger Agent with Existing ACT Structures...\n');

// Load existing ACT structures
const actFiles = [
  { name: 'ACT-2', path: '../lib/ACT-2.json' },
  { name: 'ACT-3', path: '../lib/ACT-3.json' }
];

interface TestResult {
  actName: string;
  success: boolean;
  data?: any;
  error?: string;
  duration: number;
  componentCount: number;
  componentTypes: string[];
  importsCount: number;
  codeLength: number;
}

const results: TestResult[] = [];

// Helper function to load ACT structure from file
function loadACTStructure(filePath: string): ACTComponent | null {
  try {
    const fullPath = path.resolve(__dirname, filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const actData = JSON.parse(fileContent);
    return actData as ACTComponent;
  } catch (error) {
    console.error(`❌ Failed to load ${filePath}:`, error);
    return null;
  }
}

// Helper function to save results to file
function saveTestResults(results: TestResult[]) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsDir = path.join(process.cwd(), '.merger-test-results');

  // Create results directory if it doesn't exist
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const filename = `merger-act-test-${timestamp}.md`;
  const filepath = path.join(resultsDir, filename);

  let content = `# Merger Agent ACT Structure Test Results\n\n`;
  content += `**Test Date:** ${new Date().toLocaleString()}\n\n`;
  content += `**Total Tests:** ${results.length}\n`;
  content += `**Successful:** ${results.filter((r) => r.success).length}\n`;
  content += `**Failed:** ${results.filter((r) => !r.success).length}\n\n`;

  // Summary table
  content += `## Test Summary\n\n`;
  content += `| ACT Structure | Status | Duration (ms) | Components | Types | Imports | Code Length |\n`;
  content += `|---------------|--------|---------------|------------|-------|---------|-------------|\n`;

  results.forEach((result) => {
    const status = result.success ? '✅ Success' : '❌ Failed';
    const components = result.success ? result.componentCount : '-';
    const types = result.success ? result.componentTypes.length : '-';
    const imports = result.success ? result.importsCount : '-';
    const codeLength = result.success ? result.codeLength : '-';

    content += `| ${result.actName} | ${status} | ${result.duration} | ${components} | ${types} | ${imports} | ${codeLength} |\n`;
  });

  content += `\n`;

  // Detailed results for each test
  results.forEach((result, index) => {
    content += `## Test ${index + 1}: ${result.actName}\n\n`;

    if (result.success) {
      content += `### ✅ Success\n\n`;
      content += `- **Duration:** ${result.duration}ms\n`;
      content += `- **Total Components:** ${result.componentCount}\n`;
      content += `- **Component Types:** ${result.componentTypes.join(', ')}\n`;
      content += `- **Import Statements:** ${result.importsCount}\n`;
      content += `- **Code Length:** ${result.codeLength} characters\n\n`;

      // Generated Imports
      if (result.data?.code?.imports) {
        content += `### Generated Imports\n\`\`\`typescript\n${result.data.code.imports.join(
          '\n'
        )}\n\`\`\`\n\n`;
      }

      // Generated Component Preview
      if (result.data?.code?.mainComponent) {
        content += `### Generated Component Preview\n\`\`\`typescript\n${result.data.code.mainComponent.substring(
          0,
          500
        )}...\n\`\`\`\n\n`;

        // Save the full component as a separate file
        const componentFilename = `${result.actName.toLowerCase()}-component-${timestamp}.tsx`;
        const componentFilepath = path.join(resultsDir, componentFilename);
        fs.writeFileSync(componentFilepath, result.data.code.mainComponent);
        content += `### Full Component\n\nThe complete component has been saved as: \`${componentFilename}\`\n\n`;
      }
    } else {
      content += `### ❌ Failed\n\n`;
      content += `- **Duration:** ${result.duration}ms\n`;
      content += `- **Error:** ${result.error}\n\n`;
    }
  });

  // Comparison section
  if (results.filter((r) => r.success).length > 1) {
    content += `## Comparison Analysis\n\n`;

    const successfulResults = results.filter((r) => r.success);
    const avgDuration =
      successfulResults.reduce((sum, r) => sum + r.duration, 0) /
      successfulResults.length;
    const totalComponents = successfulResults.reduce(
      (sum, r) => sum + r.componentCount,
      0
    );
    const totalImports = successfulResults.reduce(
      (sum, r) => sum + r.importsCount,
      0
    );

    content += `- **Average Duration:** ${Math.round(avgDuration)}ms\n`;
    content += `- **Total Components Generated:** ${totalComponents}\n`;
    content += `- **Total Import Statements:** ${totalImports}\n`;
    content += `- **Most Complex ACT:** ${
      successfulResults.reduce((max, r) =>
        r.componentCount > max.componentCount ? r : max
      ).actName
    }\n`;
    content += `- **Fastest Processing:** ${
      successfulResults.reduce((min, r) =>
        r.duration < min.duration ? r : min
      ).actName
    }\n\n`;
  }

  // Save the markdown report
  fs.writeFileSync(filepath, content);
  console.log(`📁 Results saved to: ${filepath}`);
  return filepath;
}

// Test function for a single ACT structure
async function testACTStructure(
  actName: string,
  actPath: string
): Promise<TestResult> {
  console.log(`\n🧪 Testing ${actName}...`);

  const startTime = Date.now();

  try {
    // Load ACT structure
    const actStructure = loadACTStructure(actPath);
    if (!actStructure) {
      throw new Error(`Failed to load ACT structure from ${actPath}`);
    }

    console.log(
      `   📄 Loaded ACT structure with ${
        actStructure.metadata?.totalComponents || 'unknown'
      } components`
    );

    // Initialize Merger Agent
    const mergerAgent = new MergerAgent();

    // Run the merge process
    console.log(`   🔄 Running merge process...`);
    const result = await mergerAgent.mergeToKendo(actStructure);

    const duration = Date.now() - startTime;

    if (result.success) {
      console.log(`   ✅ ${actName} completed successfully in ${duration}ms`);
      console.log(
        `   📊 Generated ${result.data?.code.metadata.totalComponents} components`
      );
      console.log(
        `   📦 Component types: ${result.data?.code.metadata.componentTypes.join(
          ', '
        )}`
      );
      console.log(
        `   📥 Imports: ${result.data?.code.imports.length} statements`
      );
      console.log(
        `   📝 Code length: ${result.data?.code.mainComponent.length} characters`
      );

      return {
        actName,
        success: true,
        data: result.data,
        duration,
        componentCount: result.data?.code.metadata.totalComponents || 0,
        componentTypes: result.data?.code.metadata.componentTypes || [],
        importsCount: result.data?.code.imports.length || 0,
        codeLength: result.data?.code.mainComponent.length || 0
      };
    } else {
      console.log(`   ❌ ${actName} failed: ${result.error}`);
      return {
        actName,
        success: false,
        error: result.error,
        duration,
        componentCount: 0,
        componentTypes: [],
        importsCount: 0,
        codeLength: 0
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`   ❌ ${actName} failed with error: ${errorMessage}`);

    return {
      actName,
      success: false,
      error: errorMessage,
      duration,
      componentCount: 0,
      componentTypes: [],
      importsCount: 0,
      codeLength: 0
    };
  }
}

// Main test runner
async function runAllTests() {
  console.log('🎯 Starting comprehensive merger-agent testing...\n');

  // Test each ACT structure
  for (const actFile of actFiles) {
    const result = await testACTStructure(actFile.name, actFile.path);
    results.push(result);
  }

  // Save results
  console.log('\n💾 Saving test results...');
  const resultsFile = saveTestResults(results);

  // Print summary
  console.log('\n📊 Test Summary:');
  console.log(`   Total tests: ${results.length}`);
  console.log(`   Successful: ${results.filter((r) => r.success).length}`);
  console.log(`   Failed: ${results.filter((r) => !r.success).length}`);

  if (results.filter((r) => r.success).length > 0) {
    const successfulResults = results.filter((r) => r.success);
    const avgDuration =
      successfulResults.reduce((sum, r) => sum + r.duration, 0) /
      successfulResults.length;
    const totalComponents = successfulResults.reduce(
      (sum, r) => sum + r.componentCount,
      0
    );

    console.log(`   Average duration: ${Math.round(avgDuration)}ms`);
    console.log(`   Total components generated: ${totalComponents}`);
    console.log(`   Results saved to: ${resultsFile}`);
  }

  // Show failed tests
  const failedTests = results.filter((r) => !r.success);
  if (failedTests.length > 0) {
    console.log('\n❌ Failed Tests:');
    failedTests.forEach((test) => {
      console.log(`   - ${test.actName}: ${test.error}`);
    });
  }

  console.log('\n🎉 Testing completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Check the generated .tsx files in .merger-test-results/');
  console.log('   2. Review the detailed markdown report');
  console.log('   3. Compare results across different ACT structures');
  console.log('   4. Use this data to improve your merger-agent configuration');
}

// Run the tests
runAllTests()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
