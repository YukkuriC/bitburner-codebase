// accept dumped scripts from clipboard, and overwrite home server
// providers: `pusher.py` and `/meta/s/dump.js`

import { player, terminal, paste } from '/meta/META'

export async function main(ns) {
    // 1. read clipboard
    try {
        var data = await paste()
        data = JSON.parse(data)
    } catch (e) {
        console.error(e)
        terminal.print(`Read clipboard failed: ${e}`)
        return
    }
    // 2. clear local files
    var home = player.getHomeComputer()
    Array.from(home.scripts.keys())
        .filter((x) => !data[x])
        .forEach((x) => {
            console.log(`Removed: ${x}`)
            home.removeFile(x)
        })
    // 3. write files
    for (var [fname, code] of Object.entries(data)) {
        home.writeToScriptFile(fname, code)
        console.log(`Updated: ${fname}`)
    }
}
