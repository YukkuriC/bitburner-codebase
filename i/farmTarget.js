// search for best farming target using heuristic scoring

import { bfsBind, canHack } from 'BASE.js'
import { main as route_main } from 'i/route.js'

// main search func
export async function search(ns, score_func = score_simple) {
	var mscore = -1, target = null
	await bfsBind(ns)(host => {
		if (canHack(ns, host)) {
			var score = score_func(ns, host)
			if (score > mscore) {
				mscore = score
				target = host
			}
		}
	})

	return target
}

// simple scoring
export function score_simple(ns, host) {
	var maxCash = ns.getServerMaxMoney(host)
	var minSec = ns.getServerMinSecurityLevel(host)
	return maxCash / minSec
}

export async function main(ns) {
	// search
	var target = await search(ns)
	ns.tprint(target)

	// auto route
	ns.args = [target]
	await route_main(ns)

	// return target
	return target
}