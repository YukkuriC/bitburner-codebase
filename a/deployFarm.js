import { bfsBind } from 'BASE.js'
const file = '/mod/farm.js'

export async function main(ns) {
	var target = ns.args[0]
	var forced = ns.args[1] || false

	var servers = []

	await bfsBind(ns)(deploy, canDeploy)
	ns.tprint('Total deployed:', servers)

	function canDeploy(host) {
		return ns.hasRootAccess(host)
	}

	async function deploy(host) {
		var shouldRun

		if (forced) {
			ns.scriptKill(file, host)
			shouldRun = true
		} else {
			shouldRun = !ns.scriptRunning(file, host)
		}

		// update file
		await ns.scp(file, host)

		if (shouldRun) {
			// calc thread
			var ramUse = ns.getScriptRam(file)
			var ramMax = ns.getServerMaxRam(host)
			if (host == 'home') ramMax -= ns.getServerUsedRam(host) + 100

			// run script
			var nthread = Math.floor(ramMax / ramUse)
			if (nthread > 0)
				ns.exec(file, host, nthread, target || host)

			servers.push(host)
		}
	}
}

export function autocomplete(data, args) {
	if (args.length <= 1) return [...data.servers];
}