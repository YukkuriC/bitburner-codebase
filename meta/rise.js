import { player as plr } from '/meta/META'

const skills = ['hacking', 'strength', 'defense', 'dexterity', 'agility', 'charisma']

export async function main() {
	for (var s of skills) {
		plr[s] += 1e300
		// plr[s + '_exp'] += 1e300
	}
	plr.numPeopleKilled += 114514
	plr.karma = -Infinity
}