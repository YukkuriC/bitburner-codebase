// accept dumped scripts from clipboard, and overwrite home server
// providers: `pusher.py` and `/meta/s/dump.js`

import { player, terminal, paste } from '/meta/META'

export async function main(ns) {
    // 1. read clipboard
    try {
        var data = await paste()
        data = JSON.parse(data)
    } catch (e) {
        console.log(e)
        terminal.print(`Read clipboard failed: ${e}`)
        return
    }
    // 2. clear local files
    var home = player.getHomeComputer()
    home.scripts.map(x => x.filename).filter(x => !data[x]).forEach(x => home.removeFile(x))
    // 3. write files
    for (var [fname, code] of Object.entries(data)) {
        if (fname.indexOf('/') > 0 && fname[0] != '/')
            fname = '/' + fname
        home.writeToScriptFile(player, fname, code)
    }
}