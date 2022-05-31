import { player } from 'meta/META'

const sleeves = player.sleeves
const stats = [
	'hacking', 'strength', 'defense', 'dexterity',
	'agility', 'charisma',
	'shock', // display = 100 - value
	'sync',

]
const postfixes = ['', '_exp', '_exp_mult', '_mult']

export async function main(ns) {
	while (1) {
		// augments
		for (var s of sleeves) {
			s.augmentations = JSON.parse(JSON.stringify(player.augmentations))
		}

		// sync stats
		var max_stats = {}
		for (var member of sleeves) {
			for (var s of stats) {
				for (var p of postfixes) {
					var key = s + p
					var val = member[key]
					if (val == undefined) continue
					max_stats[key] = Math.max(val, max_stats[key] || 0)
				}
			}
		}
		for (var s of sleeves)
			Object.assign(s, max_stats)

		await ns.sleep(1000)
	}
}