// root all rootable servers with current tools,
// contains no exploits

import { bfsBind, tools } from 'BASE.js'

export async function main(ns) {
	var servers = []

	await bfsBind(ns)(root, s => !ns.hasRootAccess(s))
	ns.tprint('Total hacked:', servers)

	async function root(s) {
		// ns.tprint(`Hacking: ${s}`)
		var ports = 0
		for (var t of tools) {
			if (!ns.fileExists(t)) continue
			ns[t.split('.')[0].toLowerCase()](s)
			ports++
		}
		var port_req = ns.getServerNumPortsRequired(s)
		if (ports < port_req) {
			// ns.tprint(`Failed: ${ports} < ${port_req}`)
			return
		}
		await ns.nuke(s)
		servers.push(s)
		// fuck static RAM
		if (1 == 2) {
			ns.brutessh()
			ns.ftpcrack()
			ns.relaysmtp()
			ns.httpworm()
			ns.sqlinject()
		}
	}
}