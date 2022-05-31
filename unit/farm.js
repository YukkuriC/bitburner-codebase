// `farm.js target`
// farm unit used by `deployFarm.js`

const GROW_THRESHOLD = 0.9

export async function main(ns) {
	ns.disableLog('ALL')
	var host = ns.args[0]
	var w = 0, g = 0, h = 0
	var cycle = 1

	// not for farm
	if (ns.getServerMaxMoney(host) == 0) {
		ns.print('穷！')
		return
	}

	while (cycle++) {
		// grow
		if (ns.getServerMoneyAvailable(host) < ns.getServerMaxMoney(host) * GROW_THRESHOLD) {
			ns.print('grow')
			await ns.grow(host)
			g++
		}
		// weaken
		else if (ns.getServerSecurityLevel(host) > ns.getServerMinSecurityLevel(host)) {
			ns.print('weaken')
			await ns.weaken(host)
			w++
		}
		// force hack
		else {
			ns.print('hack')
			await ns.hack(host)
			h++
		}

		// summary
		if (cycle % 10 == 0)
			ns.print(`Weaken: ${w}; Grow: ${g}; Hack: ${h}.`)
	}
}