// force root all servers with EXPLOITS, and backdoor all except world daemon
// singularity API required

import { player, terminal } from '/meta/META'
import { main as rise } from '/meta/rise'
import { bfsBind, tools } from 'BASE.js'

export async function main(ns) {
	// var origMoney = player.money
	// var origHack = player.hack
	// create tools
	var home = player.getHomeComputer()
	for (var t of tools)
		if (!home.programs.find(x => x.toLowerCase() == t.toLowerCase()))
			home.programs.push(t)
	// hack all
	await bfsBind(ns)(HHHack, (s => s != 'home'))

	async function HHHack(host, root) {
		await ns.singularity.connect(root)
		await ns.singularity.connect(host)
		await ns.brutessh(host)
		await ns.ftpcrack(host)
		await ns.relaysmtp(host)
		await ns.httpworm(host)
		await ns.sqlinject(host)
		await ns.nuke(host)
		if (host != 'w0r1d_d43m0n') {
			rise()
			await ns.singularity.installBackdoor()
		}
		terminal.print(`Hacked: ${host}`)
	}
	// back home
	await ns.singularity.connect('home')
}