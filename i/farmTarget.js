import { bfsBind, canHack } from 'BASE.js'
import { main as route_main } from 'i/route.js'

export async function main(ns) {
	var bfs = bfsBind(ns)
	var mscore = -1, target = null

	await bfs(host => {
		if (canHack(ns, host)) {
			var maxCash = ns.getServerMaxMoney(host)
			var minSec = ns.getServerMinSecurityLevel(host)
			var score = maxCash / minSec
			if (score > mscore) {
				mscore = score
				target = host
			}
		}
	})

	ns.tprint(target)

	// auto route
	ns.args = [target]
	await route_main(ns)

	// return target
	return target
}