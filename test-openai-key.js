const fetch = require('node-fetch');

const apiKey = 'sk-proj-...'; // ← Replace with your full API key

async function testKey() {
  const res = await fetch('https://api.openai.com/v1/models', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  });

  if (!res.ok) {
    console.error('❌ Invalid or rejected API key. Status:', res.status);
    const err = await res.text();
    console.error('Response:', err);
    return;
  }

  const data = await res.json();
  console.log('✅ Success! Models returned:', data.data.map(m => m.id).slice(0, 5));
}

testKey();
