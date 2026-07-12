const https = require('https');
const fs = require('fs');

const url = 'https://raw.githubusercontent.com/bitburner-official/bitburner-src/refs/heads/dev/src/ScriptEditor/NetscriptDefinitions.d.ts';
const outputPath = require('path').join(__dirname, '..', 'NetscriptDefinitions.d.ts');

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const modified = data.replace(/^export /gm, 'declare ');
    fs.writeFileSync(outputPath, modified);
    console.log('Types fetched and saved to', outputPath);
  });
}).on('error', err => {
  console.error('Error:', err.message);
});