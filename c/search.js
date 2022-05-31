import { bfsBind } from 'BASE.js'

export async function main(ns) {
	await bfsBind(ns)(h => {
		// ls
		var contracts = ns.ls(h, '.cct')
		if (contracts.length == 0) return
		ns.tprint(h, contracts)
	}, null, 'home')
}