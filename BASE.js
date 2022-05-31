export const tools = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"]

export function canHack(ns, host) {
	return ns.hasRootAccess(host) && ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(host)
}

// DFS & BFS
async function dfsCall(scanFunc, callFunc, filter = null, host = 'home', used = null) {
	filter = filter || (s => true)
	used = used || {}
	var targets = await scanFunc(host)
	for (var s of targets) {
		if (used[s]) continue
		used[s] = true
		if (callFunc && filter(s))
			await callFunc(s, host)
		await dfsCall(scanFunc, callFunc, filter, s, used)
	}
}
async function bfsCall(scanFunc, callFunc, filter = null, host = 'home') {
	filter = filter || (s => true)

	var used = {}
	var layer = [host]
	while (layer.length) {
		var newLayer = []
		for (var root of layer) {
			var targets = await scanFunc(root)
			for (var s of targets) {
				if (used[s]) continue
				used[s] = true
				if (callFunc && filter(s))
					await callFunc(s, root)
				newLayer.push(s)
			}
		}
		layer = newLayer
	}
}
export function dfsBind(ns) {
	return async function (...args) {
		await dfsCall(ns.scan, ...args)
	}
}
export function bfsBind(ns) {
	return async function (...args) {
		await bfsCall(ns.scan, ...args)
	}
}

// utils
export const sleep = (ms) => new Promise(r => setTimeout(r, ms))
export async function waitUntil(func, step = 100) {
	while (!func())
		await sleep(step)
}