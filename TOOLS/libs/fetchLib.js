const { get } = require('https')

async function fetchFromSrc(path, branch = 'dev') {
    const url = `https://raw.githubusercontent.com/bitburner-official/bitburner-src/refs/heads/${branch}/src/${path}`
    let resolver, rejecter
    let ret = new Promise((rs, rj) => {
        ;[resolver, rejecter] = [rs, rj]
    })
    get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => resolver(data))
    }).on('error', rejecter)
    return ret
}

module.exports = { fetchFromSrc }
