// first commands to run after reset

import { exec } from 'meta/exec'
import { sleep } from 'BASE'

const startup_commands = [
	'home',
	// batch 1
	// 'run a/stock.js',
	// 'run a/hacknet.js',
	// 'run s/gang.js',
	// 'run s/sleeve.js',
	'run s/companyRep.js',
	// batch 2
	'run s/rootAll.js',
	'run a/autoFarm.js',
]

export async function main(ns) {
	for (var cmd of startup_commands) {
		await exec(cmd)
	}
}