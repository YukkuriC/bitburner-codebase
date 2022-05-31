// `solve.js host filename [debug=0]`
// solve a coding contract `args[1]` on server `args[0]`
// if `args[2]` provided, then only display solution without submission.

import { dePrime, cached } from '/c/helper'

const stringfy = (o) => {
	if (typeof o == 'object') return JSON.stringify(o)
	return o + ''
}

const MAPPER = {
	"Find Largest Prime Factor": num => {
		var factors = dePrime(num)
		return Math.max(...Object.keys(factors).map(x => x * 1))
	},
	"Spiralize Matrix": array => {
		const nrow = array.length,
			ncol = array[0].length
		const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]]
		const key = (x, y) => `${x}|${y}`
		var visited = {}, res = [], x = 0, y = 0, dir_idx = 0
		for (var i = 0; i < nrow * ncol; i++) {
			// dump now
			visited[key(x, y)] = 1
			res.push(array[y][x])
			// go next
			var nx, ny
			for (var j = 0; j < 4; j++) {
				var dir = dirs[dir_idx]
				nx = x + dir[0]
				ny = y + dir[1]
				if (nx < 0 || nx >= ncol || ny < 0 || ny >= nrow || visited[key(nx, ny)]) {
					dir_idx = (dir_idx + 1) % 4
					continue
				}
				break
			}
			[x, y] = [nx, ny]
		}
		return res
	},
	// "HammingCodes: Encoded Binary to Integer": code => {
	// 	var code_novalid = []
	// 	Array.from(code).forEach((v, i) => {
	// 		i++
	// 		while (i % 2 == 0) i /= 2
	// 		if (i != 1)
	// 			code_novalid.push(v)
	// 	})
	// },
	"Total Ways to Sum": target => {
		target *= 1

		var brute = function (num, maxSplit) {
			if (num <= 0) return 1
			var res = 0
			for (var i = maxSplit; i > 0; i--) {
				var cut = num - i
				res += brute(cut, Math.min(cut, i))
			}
			return res
		}
		brute = cached(brute)

		return brute(target, target) - 1
	}
}

export async function core_solver(ns, host, filename, noReturn = false) {
	const nc = ns.codingcontract

	if (!ns.serverExists(host))
		return ns.tprint(`Invalid host: ${host}`)
	try {
		var cType = nc.getContractType(filename, host)
		var cInput = nc.getData(filename, host)
		var cTries = nc.getNumTriesRemaining(filename, host)
	} catch (e) {
		return ns.tprint(`Invalid contract: ${filename}`)
	}
	ns.tprint(`Contract ${host}|${filename}(${cTries}): "${cType}"`)
	ns.tprint(`Input: "${stringfy(cInput)}"`)

	var solver = MAPPER[cType]
	if (!solver) {
		ns.tprint(`Not yet supported`)
		if (noReturn) {
			ns.tprint(`Type: "${cType}"`)
			ns.tprint(`Descrip: "${nc.getDescription(filename, host)}"`)
		}
	} else if (cTries <= 0) {
		ns.tprint(`Contract failed`)
	} else {
		var answer = solver(cInput)
		ns.tprint(`Answer: ${answer}`)
		if (noReturn) return
		return nc.attempt(answer, filename, host, { returnReward: true })
	}
}

export async function main(ns) {
	const host = ns.args[0]
	const filename = ns.args[1]
	const debug = ns.args[2] || false
	var reward = await core_solver(ns, host, filename, debug)
	if (debug) return ns.tprint('------')
	ns.tprint(`Reward: ${reward}`)
}

export function autocomplete(data, args) {
	if (args.length == 1) return [...data.servers]
}