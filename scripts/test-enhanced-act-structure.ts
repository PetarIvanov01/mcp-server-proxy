#!/usr/bin/env tsx

/**
 * Test script for the enhanced ACT structure and improved structure agent
 * This script demonstrates the improved component mapping system
 */

import {
  ACT_ELEMENTS,
  ACT_ELEMENTS_FLAT,
  formatACTElementsForPrompt,
  getKendoComponentForACT,
  getACTElementsByCategory,
  getComponentPriority
} from '../lib/kendo-components';
import { StructureAgent } from '../lib/agents/structure-agent';

// Test queries to demonstrate the enhanced ACT structure
const testQueries = [
  'Create a dashboard with charts and data tables',
  'Build a user registration form with validation',
  'Design a product catalog with filters and search',
  'Create a task management board with drag and drop',
  'Build a data visualization dashboard with multiple chart types'
];

async function testEnhancedACTStructure() {
  console.log(
    '🚀 Testing Enhanced ACT Structure and Improved Structure Agent\n'
  );

  // Test 1: Display organized ACT elements
  console.log('📋 Organized ACT Elements by Category:');
  console.log('=====================================');

  Object.entries(ACT_ELEMENTS).forEach(([category, elements]) => {
    console.log(`\n${category}:`);
    console.log(
      `  ${elements.slice(0, 8).join(', ')}${
        elements.length > 8 ? '...' : ''
      } (${elements.length} elements)`
    );
  });

  // Test 2: Show formatted prompt context
  console.log('\n\n📝 Formatted ACT Elements for Prompt Context:');
  console.log('=============================================');
  console.log(formatACTElementsForPrompt());

  // Test 3: Test component mapping
  console.log('\n\n🔗 Component Mapping Examples:');
  console.log('==============================');

  const testComponents = [
    'container',
    'button',
    'table',
    'chart',
    'form',
    'navigation',
    'card',
    'input'
  ];
  testComponents.forEach((component) => {
    const mapping = getKendoComponentForACT(component);
    const priority = getComponentPriority(component);
    console.log(
      `${component.padEnd(12)} → ${mapping.component.padEnd(15)} (${
        mapping.category
      }, priority: ${priority})`
    );
  });

  // Test 4: Test Structure Agent with enhanced components
  console.log('\n\n🤖 Testing Structure Agent with Enhanced Components:');
  console.log('==================================================');

  const structureAgent = new StructureAgent();

  // Test component suggestions
  console.log('\nComponent Suggestions by Context:');
  const contexts = [
    'dashboard',
    'form',
    'navigation',
    'data table',
    'chart visualization'
  ];
  contexts.forEach((context) => {
    const suggestions = structureAgent.getComponentSuggestions(context);
    console.log(`${context.padEnd(20)}: ${suggestions.join(', ')}`);
  });

  // Test component validation
  console.log('\nComponent Validation:');
  const testValidation = [
    'container',
    'button',
    'invalid-component',
    'chart',
    'unknown'
  ];
  testValidation.forEach((component) => {
    const isValid = structureAgent.validateACTComponent(component);
    console.log(
      `${component.padEnd(20)}: ${isValid ? '✅ Valid' : '❌ Invalid'}`
    );
  });

  // Test 5: Show comprehensive mapping coverage
  console.log('\n\n📊 Mapping Coverage Statistics:');
  console.log('==============================');

  const totalACTElements = ACT_ELEMENTS_FLAT.length;
  console.log(`Total ACT Elements: ${totalACTElements}`);

  // Show category distribution
  console.log('\nCategory Distribution:');
  Object.entries(ACT_ELEMENTS).forEach(([category, elements]) => {
    console.log(`${category.padEnd(20)}: ${elements.length} elements`);
  });

  // Test 6: Demonstrate the improved prompt structure
  console.log('\n\n📋 Improved Structure Agent Instructions:');
  console.log('==========================================');
  console.log(
    'The structure agent now uses dynamically generated instructions'
  );
  console.log('that include the organized ACT elements for better context.');
  console.log('This allows the agent to:');
  console.log('- Choose from a comprehensive list of semantic components');
  console.log('- Understand component categories and relationships');
  console.log('- Generate more accurate and contextually appropriate ACTs');
  console.log('- Better map user requirements to available components');

  console.log('\n✅ Enhanced ACT structure testing completed!');
  console.log('\nKey Improvements:');
  console.log('- Organized ACT elements into semantic categories');
  console.log('- Dynamic prompt generation with current component list');
  console.log('- Better component suggestions and validation');
  console.log('- Improved structure agent with context-aware instructions');
  console.log('- More maintainable and extensible component system');
}

// Run the test
if (require.main === module) {
  testEnhancedACTStructure().catch(console.error);
}

export { testEnhancedACTStructure };
