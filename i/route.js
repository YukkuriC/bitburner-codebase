import { bfsBind } from 'BASE'

export async function findRoute(ns, source, target) {
	var parent = {}
	await bfsBind(ns)((h, root) => {
		parent[h] = root
	}, null, target)

	var route = [source], ptr = source
	while (ptr != target) {
		ptr = parent[ptr]
		route.push(ptr)
	}

	return route
}

export async function main(ns) {
	var target = ns.args[0]
	var source = ns.args[1] || 'home'

	if (!ns.serverExists(source)) return ns.tprint(`Invalid source: ${source}`)
	if (!ns.serverExists(target)) return ns.tprint(`Invalid target: ${target}`)

	var route = await findRoute(ns, source, target)
	ns.tprint(`Route: ${route.join(' -- ')}`)
	ns.tprint(`Length: ${route.length - 1}`)
}

export function autocomplete(data, args) {
	if (args.length <= 2)
		return [...data.servers]; // This script autocompletes the list of servers.
}