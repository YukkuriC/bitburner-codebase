import { main as m_deploy } from '/a/deployFarm'
import { main as m_search } from '/i/farmTarget'

export async function main(ns) {
	// search
	var target = await m_search(ns)

	// deploy
	ns.args = [target, 1]
	await m_deploy(ns)
}