import * as fs from 'fs';
import * as path from 'path';
import { extractKendoComponentInfo } from '../lib/utils/kendo-extraction';

async function testKendoExtraction() {
  console.log('🧪 Testing Kendo Extraction Function');

  const testDir = path.join(process.cwd(), '.kendo-mcp-tests');
  const testFiles = fs
    .readdirSync(testDir)
    .filter((file) => file.endsWith('.md'));

  console.log(`📁 Found ${testFiles.length} test files`);

  for (const file of testFiles) {
    console.log(`\n📄 Processing: ${file}`);

    const filePath = path.join(testDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    try {
      const data = extractKendoComponentInfo(file, content);

      fs.writeFileSync(
        path.join(
          '.kendo-mpc-extractions-tests',
          `${file}-${new Date()
            .toISOString()
            .replace(/[:.]/g, '-')}-multiple-components.json`
        ),
        JSON.stringify(data, null, 2)
      );
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
    }
  }

  console.log('\n✅ Testing completed!');
}

testKendoExtraction().catch(console.error);
