function calcNodeRate(level = 1, ram = 1, cores = 1) {
	return (level * 1.5) * Math.pow(1.035, ram - 1) * ((cores + 5) / 6)
}
function calcHashRate(level = 1, ram = 1, cores = 1) {
	return level * Math.pow(1.07, Math.log2(ram)) * ((cores + 4) / 5)
}

const calcFunc = calcHashRate

export async function main(ns) {
	ns.disableLog('ALL')
	var interval = ns.args[0] || 1000
	var threshold = ns.args[1] || 0.1
	var maxCount = ns.args[2] || 1e10
	var interval_mult = 1
	var actions

	while (1) {
		actions = []
		// purchase new
		var newCost = ns.hacknet.getPurchaseNodeCost()
		var nodeCount = ns.hacknet.numNodes()
		if (nodeCount < maxCount)
			actions.push([newCost / calcFunc(), newCost, ns.hacknet.purchaseNode, 'Buy new NODE'])
		// upgrades
		for (var idx = 0; idx < nodeCount; idx++)
			analyzeNodeClosure(idx)
		// sort
		actions.sort((x, y) => x[0] - y[0])
		// execute min
		var [min_score, min_cost, min_action, action_name] = actions[0]
		var max_spend = ns.getServerMoneyAvailable('home') * threshold
		if (min_cost > max_spend) {
			var span = interval * interval_mult
			ns.print(`Waiting [${action_name}] (${Math.round(max_spend - min_cost)})`)
			await ns.sleep(span)
			interval_mult++
		} else {
			ns.print(`[${action_name}] cost ${min_cost}`)
			min_action()
			interval_mult = 1
			await ns.sleep(interval)
		}
	}

	function analyzeNodeClosure(idx) {
		const nodeStats = ns.hacknet.getNodeStats(idx)
		const curRam = nodeStats.ram;
		const curLevel = nodeStats.level;
		const curCores = nodeStats.cores;
		const curProd = calcFunc(curLevel, curRam, curCores)

		const costLvl = ns.hacknet.getLevelUpgradeCost(idx),
			costRam = ns.hacknet.getRamUpgradeCost(idx),
			costCore = ns.hacknet.getCoreUpgradeCost(idx)

		const prefix = `Upgrade #${idx} `
		actions.push([
			costLvl / (calcFunc(curLevel + 1, curRam, curCores) - curProd),
			costLvl, () => ns.hacknet.upgradeLevel(idx), prefix + 'LEVEL'])
		actions.push([
			costRam / (calcFunc(curLevel, curRam * 2, curCores) - curProd),
			costRam, () => ns.hacknet.upgradeRam(idx), prefix + 'RAM'])
		actions.push([
			costCore / (calcFunc(curLevel, curRam, curCores + 1) - curProd),
			costCore, () => ns.hacknet.upgradeCore(idx), prefix + 'CORE'])
	}
}