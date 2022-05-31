import { player, terminal, copy } from '/meta/META'

export async function main(ns) {
    var server = player.getHomeComputer()
    var data = {}
    for (var s of server.scripts) {
        data[s.filename] = s.code
    }
    var json = JSON.stringify(data)
    var disp = await copy(json)
    await terminal.print(`Copied: ${disp} (${Object.keys(data).length} files, l=${json.length})`)
    await terminal.print(`Run "TOOLS/puller.py" to sync OUTSIDE`)
}