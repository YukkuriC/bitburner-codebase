/** @param {NS} ns */
export async function main(ns) {
	var script = ns.args[0]
	var host = ns.args[1] || 'home'

	var allRAM = ns.getServerMaxRam(host)
	var oneRAM = ns.getScriptRam(script)

	ns.tprint(allRAM / oneRAM)
}