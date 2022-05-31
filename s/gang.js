import { player } from 'meta/META'

const stats = [
	'agi', 'cha', 'def', 'dex', 'hack', 'str'
]
const postfixes = [
	'', '_asc_points', '_exp', '_mult'
]

export async function main(ns) {
	const equipments = ns.gang.getEquipmentNames()

	while (1) {
		const members = player.gang.members

		// recruit
		if (ns.gang.canRecruitMember()) {
			var name = `gg-${members.length}`
			ns.gang.recruitMember(name)
			ns.gang.setMemberTask(name, 'Terrorism')
			continue
		}

		// free equipments
		for (var member of members) {
			for (var e of equipments) {
				var eType = ns.gang.getEquipmentType(e)
				var pool = (eType == 'Augmentation') ? member.augmentations : member.upgrades
				if (pool.indexOf(e) < 0) pool.push(e)
			}
		}

		// sync stats
		var max_stats = {}
		for (var member of members) {
			for (var s of stats) {
				for (var p of postfixes) {
					var key = s + p
					max_stats[key] = Math.max(member[key], max_stats[key] || 0)
				}
			}
		}
		for (var member of members)
			Object.assign(member, max_stats)

		// clear wanted
		player.gang.wanted = 1

		await ns.sleep(500)
	}
}