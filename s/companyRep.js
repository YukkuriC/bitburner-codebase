// auto increase HUGE reputation among companys with faction with EXPLOITS

import { main as rise } from '/meta/rise'
import { player, terminal } from '/meta/META'

const companys = [
	'ECorp', 'MegaCorp', 'Bachman & Associates',
	'Blade Industries', 'NWO', 'Clarke Incorporated',
	'OmniTek Incorporated', 'Four Sigma',
	'KuaiGong International',
	'Fulcrum Technologies',
]
const works = [
	'software', 'software consultant', 'it',
	'security engineer', 'network engineer',
	'business', 'business consultant', 'security',
	'agent', 'employee', 'part-time employee',
	'waiter', 'part-time waiter',
]
const repLim = 1e30

export async function main(ns) {
	for (var c of companys) {
		var oldRep = ns.singularity.getCompanyRep(c), newRep = oldRep
		if (oldRep > repLim) continue
		for (var w of works) {
			rise()
			ns.singularity.applyToCompany(c, w)
			ns.singularity.workForCompany(c)
			await ns.sleep(100)
			ns.singularity.stopAction()
			newRep = ns.singularity.getCompanyRep(c)
			if (newRep > repLim) break
		}
		terminal.print(`Company ${c} increased ${newRep - oldRep}`)
	}
}