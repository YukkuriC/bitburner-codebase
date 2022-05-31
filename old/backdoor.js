import { bfsBind, canHack } from 'BASE'
import { exec } from '/meta/exec'

export async function main(ns) {
	await bfsBind(ns)(backdoor)
	async function backdoor(s, root) {
		await exec(`connect ${root};connect ${s}`)
		if (canHack(ns, s))
			await exec('backdoor')
	}
}