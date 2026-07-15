const fs = require('fs')
const { fetchFromSrc } = require('./libs/fetchLib')

const outputPath = require('path').join(__dirname, '..', 'NetscriptDefinitions.d.ts')

;(async () => {
    const data = await fetchFromSrc('ScriptEditor/NetscriptDefinitions.d.ts')
    const modified = data.replace(/^export /gm, 'declare ')
    fs.writeFileSync(outputPath, modified)
    console.log('Types fetched and saved to', outputPath)
})()
