import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });

import { MergerAgent } from '../lib/agents/merger-agent';
import { ACTComponent } from '../lib/types';
import * as fs from 'fs';
import * as path from 'path';

const ACT_PATH = path.resolve(__dirname, '../lib/ACT-4.json');

async function quickTest() {
  console.log('🚀 Quick Merger Agent Test\n');

  try {
    console.log('📄 Loading ACT-1 structure...');
    const actData = JSON.parse(fs.readFileSync(ACT_PATH, 'utf-8'));
    const actStructure = actData as ACTComponent;

    console.log(
      `✅ Loaded ACT with ${
        actStructure.metadata?.totalComponents || 'unknown'
      } components`
    );
    console.log(
      `   Component types: ${
        actStructure.metadata?.componentTypes?.join(', ') || 'unknown'
      }\n`
    );

    // Initialize merger agent
    console.log('🔧 Initializing Merger Agent...');
    const mergerAgent = new MergerAgent();

    // Run the merge
    console.log('🔄 Converting ACT to Kendo components...');
    const startTime = Date.now();

    const result = await mergerAgent.mergeToKendo(actStructure);

    const duration = Date.now() - startTime;

    if (result.success) {
      console.log(`\n✅ Success! Completed in ${duration}ms`);
      console.log(
        `📊 Generated ${result.data?.code.metadata.totalComponents} components`
      );
      console.log(
        `📦 Types: ${result.data?.code.metadata.componentTypes.join(', ')}`
      );
      console.log(`📥 Imports: ${result.data?.code.imports.length} statements`);
      console.log(
        `📝 Code length: ${result.data?.code.mainComponent.length} characters`
      );

      // Save the generated component
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputDir = path.join(process.cwd(), '.merger-test-results');

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const componentFile = path.join(outputDir, `quick-test-${timestamp}.tsx`);
      fs.writeFileSync(componentFile, result.data?.code.mainComponent || '');

      console.log(`\n💾 Generated component saved to: ${componentFile}`);

      // Show a preview of the generated code
      console.log('\n📝 Generated Component Preview:');
      console.log('─'.repeat(60));
      console.log(result.data?.code.imports);
      console.log(result.data?.code.mainComponent.substring(0, 800));
      if (result.data?.code.mainComponent.length > 800) {
        console.log('\n... (truncated)');
      }
      console.log('─'.repeat(60));
    } else {
      console.log(`\n❌ Failed: ${result.error}`);
    }

    // Cleanup
    mergerAgent.cleanup();
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the quick test
quickTest()
  .then(() => {
    console.log('\n🎉 Quick test completed!');
    console.log('\n💡 To run the full test suite with all ACT structures:');
    console.log('   pnpm tsx scripts/test-merger-with-act.ts');
  })
  .catch((error) => {
    console.error('❌ Quick test failed:', error);
    process.exit(1);
  });
