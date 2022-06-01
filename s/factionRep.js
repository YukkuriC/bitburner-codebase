// auto increase HUGE faction reputation with EXPLOITS

import { main as rise } from '/meta/rise'
import { player, terminal } from '/meta/META'

const works = ['Hacking Contracts', 'Field Work', 'Security Work']
const repLim = 1e30

export async function main(ns) {
	for (var f of player.factions) {
		var oldRep = ns.singularity.getFactionRep(f), newRep = oldRep
		if (oldRep > repLim) continue
		for (var w of works) {
			rise()
			ns.singularity.workForFaction(f, w)
			await ns.sleep(100)
			ns.singularity.stopAction()
			newRep = ns.singularity.getFactionRep(f)
			if (newRep > repLim) break
		}
		terminal.print(`Faction ${f} increased ${newRep - oldRep}`)
	}
}