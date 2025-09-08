import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });

import { MergerAgent } from '../lib/agents/merger-agent';
import { ACTComponent } from '../lib/types';
import * as fs from 'fs';
import * as path from 'path';

console.log('🚀 Testing Merger Agent with MCP Integration...\n');

// Test 1: Create a simple ACT structure
console.log('1️⃣ Creating test ACT structure...');
const testACT: ACTComponent = {
  type: 'container',
  children: [
    {
      type: 'button',
      props: {
        text: 'Click me',
        onClick: 'handleClick'
      }
    },
    {
      type: 'table',
      props: {
        data: 'sampleData',
        columns: ['name', 'email', 'role']
      }
    }
  ]
};

console.log('✅ Test ACT structure created');
console.log(
  '   Components:',
  testACT.children?.map((c: ACTComponent) => c.type).join(', ')
);

// Test 2: Initialize Merger Agent
console.log('\n2️⃣ Initializing Merger Agent...');
const mergerAgent = new MergerAgent();
console.log('✅ Merger Agent initialized');

// Helper function to save results to file
function saveResults(result: any, testACT: ACTComponent) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const resultsDir = path.join(process.cwd(), '.merger-test-results');

  // Create results directory if it doesn't exist
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  const filename = `merger-test-${timestamp}.md`;
  const filepath = path.join(resultsDir, filename);

  let content = `# Merger Agent Test Results\n\n`;
  content += `**Test Date:** ${new Date().toLocaleString()}\n\n`;

  // Test ACT Structure
  content += `## Test ACT Structure\n\`\`\`json\n${JSON.stringify(
    testACT,
    null,
    2
  )}\n\`\`\`\n\n`;

  if (result.success) {
    content += `## ✅ Test Results - SUCCESS\n\n`;
    content += `- **Total Components:** ${result.data?.code.metadata.totalComponents}\n`;
    content += `- **Component Types:** ${result.data?.code.metadata.componentTypes.join(
      ', '
    )}\n`;
    content += `- **Import Statements:** ${result.data?.code.imports.length}\n`;
    content += `- **Main Component Length:** ${result.data?.code.mainComponent.length} characters\n\n`;

    // Generated Imports
    content += `## Generated Imports\n\`\`\`typescript\n${result.data?.code.imports.join(
      '\n'
    )}\n\`\`\`\n\n`;

    // Generated Component
    content += `## Generated Component\n\`\`\`typescript\n${result.data?.code.mainComponent}\n\`\`\`\n\n`;

    // Save the component as a separate .tsx file
    const componentFilename = `generated-component-${timestamp}.tsx`;
    const componentFilepath = path.join(resultsDir, componentFilename);
    fs.writeFileSync(componentFilepath, result.data?.code.mainComponent || '');
    content += `## Generated Component File\n\nThe component has been saved as: \`${componentFilename}\`\n\n`;
  } else {
    content += `## ❌ Test Results - FAILED\n\n`;
    content += `**Error:** ${result.error}\n\n`;
  }

  // Save the markdown report
  fs.writeFileSync(filepath, content);

  console.log(`📁 Results saved to: ${filepath}`);
  if (result.success) {
    console.log(
      `📄 Component saved to: ${path.join(
        resultsDir,
        `generated-component-${timestamp}.tsx`
      )}`
    );
  }

  return filepath;
}

// Test 3: Run the merge process
console.log('\n3️⃣ Running merge process...');
async function runTest() {
  try {
    const result = await mergerAgent.mergeToKendo(testACT);

    if (result.success) {
      console.log('✅ Merge process completed successfully');
      console.log('📊 Results:');
      console.log(
        `   - Total components: ${result.data?.code.metadata.totalComponents}`
      );
      console.log(
        `   - Component types: ${result.data?.code.metadata.componentTypes.join(
          ', '
        )}`
      );
      console.log(
        `   - Imports: ${result.data?.code.imports.length} import statements`
      );
      console.log(
        `   - Main component length: ${result.data?.code.mainComponent.length} characters`
      );

      // Show a preview of the generated code
      if (result.data?.code.mainComponent) {
        console.log('\n📝 Generated Component Preview:');
        console.log(result.data.code.mainComponent.substring(0, 300) + '...');
      }
    } else {
      console.log('❌ Merge process failed');
      console.log('   Error:', result.error);
    }

    // Save results to file
    console.log('\n💾 Saving results to file...');
    const savedFile = saveResults(result, testACT);
    console.log(`✅ Results saved successfully!`);
  } catch (error) {
    console.error('❌ Test failed:', error);

    // Save error results too
    console.log('\n💾 Saving error results to file...');
    const errorResult = {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
    const savedFile = saveResults(errorResult, testACT);
    console.log(`✅ Error results saved successfully!`);
  } finally {
    // Cleanup
    mergerAgent.cleanup();
    console.log('\n🧹 Cleanup completed');
  }
}

// Run the test
runTest()
  .then(() => {
    console.log('\n📊 Test Summary:');
    console.log(
      '   This test verifies the Merger Agent can use MCP documentation'
    );
    console.log(
      '   If successful, your app should generate better Kendo components'
    );

    console.log('\n💡 Next steps:');
    console.log('   1. Start your app: npm run dev');
    console.log('   2. Test component generation through your API');
    console.log('   3. Check console logs for MCP integration status');
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
