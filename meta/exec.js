// execute a terminal command, and wait for complete;
// pass `args[0]` to directly execute the command;
// a workaround before `BN4`.

import { sleep, waitUntil } from "BASE"
import { props as p } from '/meta/META'

export async function exec(command, verbose = true) {
	if (verbose) p.terminal.print('>>> ' + command)
	await p.terminal.executeCommands(p.router, p.player, command)
	if (p.terminal.action) await sleep(10)
	// wait until terminal free
	await waitUntil(()=>!p.terminal.action)
}

export async function main(ns) {
	var command = ns.args[0] || "analyze";
	await exec(command)
}