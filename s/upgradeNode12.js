import { breaker } from '/s/break'

export async function main(ns) {
	await breaker(ns, 12, '/s/upgradeNode12.js')
}