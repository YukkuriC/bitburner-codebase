// auto `deployFarm`, attacking target decided by `farmTarget`

import { main as m_deploy } from '/old/deployFarm'
import { main as m_search } from '/i/farmTarget'

export async function main(ns) {
	// search
	var target = await m_search(ns)

	// deploy
	ns.args = [target, 1]
	await m_deploy(ns)
}