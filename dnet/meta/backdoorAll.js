// backdoor all servers reachable from given darknet server
// optional arg to lock their positions
import { bfsCall } from '../../BASE'
const SuperTerminal = terminal.meta

/** @param {NS} ns */
export async function main(ns) {
    const servers = {}
    const getServer = (host) => {
        if (!servers[host]) {
            servers[host] = SuperTerminal.getServer(host)
        }
        return servers[host]
    }

    let cnt = 0
    await bfsCall(
        (host) => {
            const server = getServer(host)
            const subs = server.serversOnNetwork
            return subs.filter((s) => ns.dnet.isDarknetServer(s))
        },
        (host) => {
            const server = getServer(host)
            if (!server.backdoorInstalled) cnt++
            server.backdoorInstalled = true
            ns.print('backdooring: ' + host)
            server.isStationary = host === 'darkweb' || !!ns.args[0]
        },
    )
    ns.tprint(`Total ${cnt} backdoored`)
}
