#!/usr/bin/env node

/**
 * Simple script to test license file configuration
 * Usage: node scripts/test-license.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing License Configuration...\n');

// Test 1: Check if license file exists
const licensePath = path.join(process.cwd(), 'telerik-license.txt');
console.log(`1️⃣ Checking license file: ${licensePath}`);

if (fs.existsSync(licensePath)) {
  console.log('✅ License file exists');

  // Test 2: Check file content
  try {
    const licenseContent = fs.readFileSync(licensePath, 'utf8');
    console.log(`2️⃣ License file size: ${licenseContent.length} characters`);

    if (licenseContent.trim().length > 0) {
      console.log('✅ License file has content');

      // Show first few lines (without exposing the actual license)
      const lines = licenseContent.split('\n');
      console.log(`3️⃣ First line preview: ${lines[0].substring(0, 50)}...`);
      console.log(`   Total lines: ${lines.length}`);
    } else {
      console.log('❌ License file is empty');
    }
  } catch (error) {
    console.log('❌ Error reading license file:', error.message);
  }
} else {
  console.log('❌ License file not found');
  console.log(
    '   Please ensure telerik-license.txt exists in the project root'
  );
}

// Test 3: Check environment variables
console.log('\n4️⃣ Checking environment variables:');
const envVars = ['TELERIK_LICENSE', 'KENDO_UI_LICENSE', 'TELERIK_LICENSE_PATH'];
let hasEnvLicense = false;

envVars.forEach((envVar) => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar} is set`);
    hasEnvLicense = true;
  } else {
    console.log(`⚠️ ${envVar} is not set`);
  }
});

// Summary
console.log('\n📊 License Configuration Summary:');
console.log(`   License File: ${fs.existsSync(licensePath) ? '✅' : '❌'}`);
console.log(`   Environment Variables: ${hasEnvLicense ? '✅' : '⚠️'}`);

if (fs.existsSync(licensePath)) {
  console.log('\n🎉 License file is properly configured!');
  console.log('   Your MCP server should be able to use this license.');
} else if (hasEnvLicense) {
  console.log('\n✅ License is configured via environment variables.');
} else {
  console.log('\n⚠️ No license configuration found.');
  console.log(
    '   Please add your Telerik license to telerik-license.txt or set environment variables.'
  );
}

console.log('\n💡 Next steps:');
console.log('   1. Start your Next.js app: npm run dev');
console.log('   2. Check the console for MCP connection logs');
console.log('   3. Test component generation to verify license is working');
