import { player, terminal } from '/meta/META'
import { main as factionRep } from '/s/factionRep'

export async function main(ns) {
	await factionRep(ns)

	while (1) {
		var cnt = 0
		for (var f of player.factions) {
			for (var a of ns.singularity.getAugmentationsFromFaction(f)) {
				if (player.augmentations.find(x => x.name == a)) continue
				var [rep, cost] = ns.singularity.getAugmentationCost(a)
				player.money += cost
				var success = ns.singularity.purchaseAugmentation(f, a)
				if (success) {
					cnt++
					terminal.print(`Purchased ${a} from ${f}`)
				} else {
					player.money -= cost
				}
			}
		}
		await ns.sleep(100)
		if (cnt == 0) break
	}
}