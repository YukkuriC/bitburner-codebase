import { call, callWait } from '../libs/callLib'
import { resendUntilReached } from '../libs/authLib'
const SuperTerminal = terminal.meta

const DARK_HOST = 'darkweb'

export async function main(ns: NS) {
    const host = ns.getHostname()
    const darkHost = SuperTerminal.getServer(DARK_HOST)
    if (host !== DARK_HOST) {
        darkHost.setMaxRam(1e300)
        await callWait(ns, 'copier', host, [DARK_HOST])
        return await call(ns, 'meta/maze', DARK_HOST, ns.args as any)
    }

    const target = String(ns.args[0])
    const server = SuperTerminal.getServer(target)
    if (server?.modelId != '(The Labyrinth)') throw 'invalid server: ' + target
    server.backdoorInstalled = true
    if (!darkHost.serversOnNetwork.includes(target)) {
        darkHost.serversOnNetwork.push(target)
        server.serversOnNetwork.push(DARK_HOST)
    }

    // start cracking
    const dirMap = ['north', 'east', 'south', 'west']
    let win = false
    const oppoDir = {
        north: 'south',
        south: 'north',
        east: 'west',
        west: 'east',
    }

    const visited = {}
    async function dfs() {
        if (win) return
        const report = await ns.dnet.labreport()
        ns.print('at: ' + report.coords)
        if (visited[report.coords]) return
        visited[report.coords] = true
        for (const dir of dirMap) {
            if (!report[dir]) continue
            // in
            const auth = await resendUntilReached(ns, target, dir)
            ns.print('goto: ' + dir)
            if (auth.success) {
                win = true
                return
            }
            await dfs()

            // out
            await resendUntilReached(ns, target, oppoDir[dir])
            ns.print('return to: ' + oppoDir[dir])
        }
    }

    await dfs()
    ns.tprint(`maze end, win=${win}`)
    await ns.singularity.connect(target)
}
