import { exec } from '/meta/exec'
import { findRoute } from '/i/route'

export async function main(ns) {
	if (ns.getHostname() != 'home')
		exec('connect home', false)
	var target = ns.args[0] || 'home'
	var route = await findRoute(ns, 'home', target)
	var command = route.slice(1).map(x => `connect ${x}`).join(';')
	exec(command, false)
}

export function autocomplete(data, args) {
	if (args.length <= 1)
		return [...data.servers]; // This script autocompletes the list of servers.
}