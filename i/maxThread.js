// `maxThread.js script [host=home]`
// calculate & display how many thread the server `args[1]` can run `args[0]` with

export async function main(ns) {
	var script = ns.args[0]
	var host = ns.args[1] || 'home'

	var allRAM = ns.getServerMaxRam(host)
	var oneRAM = ns.getScriptRam(script)

	ns.tprint(allRAM / oneRAM)
}