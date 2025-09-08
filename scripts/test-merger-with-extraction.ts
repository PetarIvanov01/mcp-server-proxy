import { MergerAgent } from '../lib/agents/merger-agent';
import { ACTComponent } from '../lib/types';

async function testMergerWithExtraction() {
  console.log('🧪 Testing Merger Agent with New Extraction Function');

  const mergerAgent = new MergerAgent();

  // Sample ACT structure to test with
  const sampleACT: ACTComponent = {
    structure: {
      component: 'admin-panel',
      componentProps: {
        name: 'AdminPanel',
        description: 'Main admin interface'
      },
      children: [
        {
          component: 'header',
          componentProps: {
            title: 'Admin Dashboard'
          },
          children: [
            {
              component: 'button',
              componentProps: {
                text: 'Settings',
                variant: 'primary'
              }
            }
          ]
        },
        {
          component: 'data-grid',
          componentProps: {
            columns: ['ID', 'Name', 'Email', 'Role'],
            data: 'users'
          }
        }
      ]
    }
  };

  try {
    console.log('🔧 Testing with sample ACT structure...');
    console.log('📋 ACT Structure:', JSON.stringify(sampleACT, null, 2));

    const result = await mergerAgent.mergeToKendo(sampleACT);

    if (result.success) {
      console.log('✅ Merger successful!');
      console.log(
        '📦 Generated components:',
        result.data?.code?.metadata?.componentTypes || []
      );
      console.log(
        '📊 Total components:',
        result.data?.code?.metadata?.totalComponents || 0
      );
      console.log('📝 Imports:', result.data?.code?.imports?.length || 0);

      // Show first few lines of generated code
      const mainComponent = result.data?.code?.mainComponent || '';
      const codePreview = mainComponent.substring(0, 300) + '...';
      console.log('💻 Code preview:', codePreview);
    } else {
      console.error('❌ Merger failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    mergerAgent.cleanup();
  }
}

// Only run if called directly
if (require.main === module) {
  testMergerWithExtraction().catch(console.error);
}

export { testMergerWithExtraction };
