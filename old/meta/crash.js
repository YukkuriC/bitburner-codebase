// cause an instant crash in terminal,
// no more crashing in v3

import { sleep, waitUntil } from 'BASE'
import { player, terminal } from '/meta/META'

export async function main(ns) {
	terminal.print(ns)
}