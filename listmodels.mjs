import fs from 'fs';

const line = fs.readFileSync('.env', 'utf8')
  .split('\n')
  .find(l => l.startsWith('GEMINI_API_KEY'));
const key = line.split('=')[1].replace(/["']/g, '').trim();

const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + key);
const data = await res.json();

if (!data.models) {
  console.log('RESPONSE:', JSON.stringify(data, null, 2));
} else {
  console.log('=== Models that support generateContent ===');
  data.models
    .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
    .forEach(m => console.log(m.name, '|', m.displayName));
}
