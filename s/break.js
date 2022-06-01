// auto crack current BitNode with source hack
// jump to BN#`args[0]` if provided
// call `args[1]` after jump if provided

import { player, global } from '/meta/META'
import { main as root } from '/s/rootAll'
import { main as rep } from '/s/factionRep'
import { main as aug } from '/s/augments'

function store_args(nextNode, nextScript) {
	global.tmp_args = [nextNode, nextScript]
}
function recover_args() {
	var res = global.tmp_args
	global.tmp_args = undefined
	return res

}

export async function breaker(ns, nextNode, nextScript) {
	var last_args = recover_args()
	if (last_args && last_args.length == 2) {
		[nextNode, nextScript] = last_args
	}

	// root all
	await root(ns)

	// restart self
	if (!player.augmentations.find(a => a.name == 'The Red Pill')) {
		if (player.factions.indexOf('Daedalus') < 0)
			player.factions.push('Daedalus')
		await rep(ns)
		await aug(ns)
		store_args(nextNode, nextScript)
		await ns.installAugmentations('/s/break.js')
		return
	}

	// crack daemon
	console.log(nextNode, nextScript)
	if (nextNode != undefined) // direct loop
		await ns.singularity.destroyW0r1dD43m0n(nextNode, nextScript)
	else { // goto b1t.exe
		await ns.singularity.connect('The-Cave')
		await ns.singularity.connect('w0r1d_d43m0n')
		await ns.singularity.installBackdoor()
	}
}


export async function main(ns) {
	await breaker(ns, ...ns.args)
}