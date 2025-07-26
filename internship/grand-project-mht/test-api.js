#!/usr/bin/env node

/**
 * Test script for Mental Health Tracker API
 * Run with: node test-api.js
 */

const BASE_URL = 'http://localhost:3000';

// Test data
const testUser = {
  id: 'test-user-123',
  email: 'test@example.com'
};

const testMood = {
  userId: testUser.id,
  userEmail: testUser.email,
  mood: 'I am feeling anxious about my upcoming presentation tomorrow. I keep thinking about all the things that could go wrong.',
  moodScore: 3
};

async function testAPI() {
  console.log('🧪 Testing Mental Health Tracker API...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Testing health check...');
    const healthResponse = await fetch(`${BASE_URL}/api/test`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check passed:', healthData.message);
    console.log('   Status:', healthData.status);
    console.log('   Timestamp:', healthData.timestamp);
    console.log('');

    // Test 2: Create mood entry
    console.log('2️⃣ Testing mood entry creation...');
    const createResponse = await fetch(`${BASE_URL}/api/mood-entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMood),
    });

    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ Mood entry created successfully!');
      console.log('   Entry ID:', createData.entry._id);
      console.log('   AI Message:', createData.entry.aiMessage.substring(0, 100) + '...');
      console.log('   AI Tip:', createData.entry.aiTip?.substring(0, 50) + '...');
      console.log('   Mood Score:', createData.entry.moodScore);
      console.log('');

      // Test 3: Get mood entries
      console.log('3️⃣ Testing mood entries retrieval...');
      const getResponse = await fetch(`${BASE_URL}/api/mood-entries?userId=${testUser.id}&limit=5`);
      const getData = await getResponse.json();
      
      if (getData.entries && getData.entries.length > 0) {
        console.log('✅ Mood entries retrieved successfully!');
        console.log('   Total entries:', getData.pagination.total);
        console.log('   Entries returned:', getData.entries.length);
        console.log('   Latest entry:', getData.entries[0].mood.substring(0, 50) + '...');
        console.log('');

        // Test 4: Delete mood entry
        console.log('4️⃣ Testing mood entry deletion...');
        const deleteResponse = await fetch(`${BASE_URL}/api/mood-entries?id=${createData.entry._id}&userId=${testUser.id}`, {
          method: 'DELETE',
        });

        if (deleteResponse.ok) {
          console.log('✅ Mood entry deleted successfully!');
        } else {
          console.log('❌ Failed to delete mood entry');
        }
      } else {
        console.log('❌ No mood entries found');
      }
    } else {
      const errorData = await createResponse.json();
      console.log('❌ Failed to create mood entry:', errorData.error);
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

async function testN8nWebhook() {
  console.log('\n🔗 Testing n8n webhook integration...\n');

  const n8nUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/mood-analysis';
  
  try {
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: testUser.id,
        userEmail: testUser.email,
        mood: 'I am feeling grateful today for all the support I have received.',
        moodScore: 8,
        timestamp: new Date().toISOString(),
        source: 'test-script'
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ n8n webhook responded successfully!');
      console.log('   AI Message:', data.aiMessage?.substring(0, 100) + '...');
      console.log('   AI Tip:', data.aiTip?.substring(0, 50) + '...');
      console.log('   Mood Analysis:', data.moodAnalysis);
      console.log('   Suggested Actions:', data.suggestedActions?.join(', '));
    } else {
      console.log('❌ n8n webhook failed:', response.status, response.statusText);
      console.log('   Make sure n8n is running and the webhook is configured correctly');
    }
  } catch (error) {
    console.log('❌ n8n webhook test failed:', error.message);
    console.log('   This is expected if n8n is not running');
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Mental Health Tracker API Tests\n');
  
  await testAPI();
  await testN8nWebhook();
  
  console.log('\n✨ Test completed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Start your Next.js app: npm run dev');
  console.log('   2. Start n8n: n8n start');
  console.log('   3. Configure your environment variables');
  console.log('   4. Test the full application flow');
}

// Check if running directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testAPI, testN8nWebhook }; 