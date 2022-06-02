// deploy farming code to all rooted servers, and attack 
// keeps running to control all deployed servers

import { bfsBind } from 'BASE.js'
import { search } from '/i/farmTarget'

const ACTION_MAP = Object.fromEntries(['grow', 'hack', 'weaken'].map(x => [x, `/unit/u_${x}.js`]))
const FILES = Object.values(ACTION_MAP)
const CONFIG = {
	HOME_RESERVE_RAM: 100,
	SLEEP_INTERVAL: 500,
	ITER_INTERVAL: 1,
	GROW_THRESHOLD: 0.9,
	SERVER_CHOICE_EXPIRE: 30 * 1e3,
	SUMMARY_LOOPS: 60,
	// update rate adjust
	SLEEP_DECREASE_RATE: 0.8,
	SLEEP_INCREASE_RATE: 1.05,
}

function runScript(ns, action, host, target) {
	var file = ACTION_MAP[action]

	// calc thread
	var ramUse = ns.getScriptRam(file)
	var ramMax = ns.getServerMaxRam(host) - ns.getServerUsedRam(host)
	if (host == 'home') ramMax -= CONFIG.HOME_RESERVE_RAM

	// run script
	var nthread = Math.floor(ramMax / ramUse)
	if (nthread > 0)
		ns.exec(file, host, nthread, target || host)

	return nthread
}

function chooseAction(ns, host, target) {
	// wait for complete
	for (var script of FILES) {
		if (ns.scriptRunning(script, host))
			return null
	}

	// analyze action
	if (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target) * CONFIG.GROW_THRESHOLD) return 'grow'
	if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) return 'weaken'
	return 'hack'
}

export async function main(ns) {
	var target = ns.args[0]
	ns.disableLog('ALL')
	ns.tail()

	var servers = []

	// copy FILES to servers
	await bfsBind(ns)(async host => {
		if (host != 'home')
			await ns.scp(FILES, host)
		servers.push(host)
	}, host => ns.hasRootAccess(host) && ns.getServerMaxRam(host) > 0)
	ns.tprint('Total deployed:', servers)

	// loop hosts
	var loop = 1, target = null, expire = 0
	var counter = {}
	while (loop++) {
		// relocate best server
		var now = new Date()
		if (now - expire > CONFIG.SERVER_CHOICE_EXPIRE) {
			var newTarget = await search(ns)
			expire = now
			if (newTarget != target) {
				target = newTarget
				ns.print(`Choose target: ${target}`)
			}
		}

		// update all servers
		var newActionCount = 0
		for (var host of servers) {
			var action = chooseAction(ns, host, target)
			if (action) {
				var times = runScript(ns, action, host, target)
				counter[action] = (counter[action] || 0) + times
				newActionCount++
			}
			await ns.sleep(CONFIG.ITER_INTERVAL)
		}

		// auto adjust frame length
		if (newActionCount < 0.1 * servers.length) {// too many wait
			CONFIG.SLEEP_INTERVAL++
			CONFIG.SLEEP_INTERVAL *= CONFIG.SLEEP_INCREASE_RATE
		} else if (newActionCount > 0.9 * servers.length) {// too long
			CONFIG.SLEEP_INTERVAL *= CONFIG.SLEEP_DECREASE_RATE
		}

		// summary
		if (loop % CONFIG.SUMMARY_LOOPS == 0) {
			ns.print(`Loop #${loop}, attacking ${target}`)
			ns.print(Object.entries(counter).map(x => x.join(': ')).join('; '))
			ns.print(`Update interval: ${CONFIG.SLEEP_INTERVAL.toFixed(2)}`)
		}
		await ns.sleep(CONFIG.SLEEP_INTERVAL)
	}
}

export function autocomplete(data, args) {
	if (args.length <= 1) return [...data.servers];
}